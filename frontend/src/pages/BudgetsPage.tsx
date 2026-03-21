import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useCurrency } from "../context/CurrencyContext";
import { supabase } from "../lib/supabase";
import AppLayout from "../components/layout/AppLayout";

// ── TYPES ──────────────────────────────────────────────────────────────────
interface Budget {
  id: string;
  category: string;
  limit_amount: number;
  month: string;
}
interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  date: string;
}

// ── ICONS ──────────────────────────────────────────────────────────────────
const PlusIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const XIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const EditIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const AlertIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const CheckCircleIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const BudgetIcon = () => (
  <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
  </svg>
);

// ── CONSTANTS ──────────────────────────────────────────────────────────────
const EXPENSE_CATEGORIES = ["Food", "Transport", "Entertainment", "Bills", "Shopping", "Health", "Education", "Other"];
const CATEGORY_COLORS: Record<string, string> = {
  Food: "#10B981", Transport: "#38BDF8", Entertainment: "#A78BFA",
  Bills: "#F97316", Shopping: "#F43F5E", Health: "#34D399",
  Education: "#FBBF24", Other: "#94A3B8",
};

// ── BUDGET MODAL ───────────────────────────────────────────────────────────
function BudgetModal({ onClose, onSave, editData, existingCategories }: {
  onClose: () => void;
  onSave: (category: string, limit: number, month: string) => Promise<void>;
  editData?: Budget | null;
  existingCategories: string[];
}) {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [category, setCategory] = useState(editData?.category || "");
  const [limit, setLimit] = useState(editData?.limit_amount?.toString() || "");
  const [month, setMonth] = useState(editData?.month || currentMonth);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const availableCategories = editData ? EXPENSE_CATEGORIES : EXPENSE_CATEGORIES.filter((c) => !existingCategories.includes(c));

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!category) errs.category = "Select a category";
    if (!limit || isNaN(Number(limit)) || Number(limit) <= 0) errs.limit = "Enter a valid amount";
    if (!month) errs.month = "Select a month";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    await onSave(category, Number(limit), month);
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{editData ? "Edit Budget" : "Set Budget"}</div>
          <button className="modal-close" onClick={onClose}><XIcon /></button>
        </div>
        <div className="form-group">
          <label className="form-label">Category</label>
          {availableCategories.length === 0 ? (
            <div style={{ color: "var(--slate)", fontSize: "0.85rem", padding: "12px", background: "var(--glass-bg)", borderRadius: "10px", border: "1px solid var(--glass-border)" }}>
              All categories already have budgets for this month!
            </div>
          ) : (
            <div className="category-grid">
              {availableCategories.map((cat) => {
                const color = CATEGORY_COLORS[cat] || "#94A3B8";
                return (
                  <button key={cat} className={`category-chip ${category === cat ? "selected" : ""}`}
                    style={{ "--chip-color": color } as any} onClick={() => setCategory(cat)}>{cat}</button>
                );
              })}
            </div>
          )}
          {errors.category && <div className="error-msg">{errors.category}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Monthly Limit</label>
          <div className={`amount-input-wrap ${errors.limit ? "input-error" : ""}`}>
            <span className="amount-prefix">$</span>
            <input type="number" placeholder="0.00" value={limit} onChange={(e) => setLimit(e.target.value)} className="amount-input" min="0" step="0.01" />
          </div>
          {errors.limit && <div className="error-msg">{errors.limit}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Month</label>
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className={`text-input ${errors.month ? "input-error" : ""}`} />
          {errors.month && <div className="error-msg">{errors.month}</div>}
        </div>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save-budget" onClick={handleSave} disabled={loading || availableCategories.length === 0}>
            {loading ? <div className="spinner" /> : editData ? "Save Changes" : "Set Budget"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── BUDGET CARD ────────────────────────────────────────────────────────────
function BudgetCard({ budget, spent, onEdit, onDelete }: {
  budget: Budget; spent: number; onEdit: () => void; onDelete: () => void;
}) {
  const { formatAmount: formatCurrency } = useCurrency();
  const color = CATEGORY_COLORS[budget.category] || "#94A3B8";
  const pct = Math.min(Math.round((spent / budget.limit_amount) * 100), 100);
  const isOver = spent > budget.limit_amount;
  const isWarning = pct >= 80 && !isOver;
  const remaining = budget.limit_amount - spent;
  const barColor = isOver ? "#ef4444" : isWarning ? "#f97316" : color;
  const statusColor = isOver ? "#ef4444" : isWarning ? "#f97316" : "#34D399";

  return (
    <div className={`budget-card ${isOver ? "budget-card-over" : isWarning ? "budget-card-warning" : ""}`}>
      <div className="budget-card-header">
        <div className="budget-cat-icon" style={{ background: `${color}18`, border: `1px solid ${color}30`, color }}>{budget.category.slice(0, 2)}</div>
        <div className="budget-card-info">
          <div className="budget-cat-name">{budget.category}</div>
          <div className="budget-month">{new Date(budget.month + "-01").toLocaleString("default", { month: "long", year: "numeric" })}</div>
        </div>
        <div className="budget-card-actions">
          <button className="btn-icon edit" onClick={onEdit} title="Edit"><EditIcon /></button>
          <button className="btn-icon delete" onClick={onDelete} title="Delete"><TrashIcon /></button>
        </div>
      </div>
      {isOver && <div className="budget-alert budget-alert-over"><AlertIcon /> Over budget by {formatCurrency(spent - budget.limit_amount)}!</div>}
      {isWarning && <div className="budget-alert budget-alert-warning"><AlertIcon /> {100 - pct}% of budget remaining</div>}
      {!isOver && !isWarning && pct === 100 && <div className="budget-alert budget-alert-ok"><CheckCircleIcon /> Budget fully used</div>}
      <div className="budget-progress-section">
        <div className="budget-progress-labels">
          <span className="budget-spent">{formatCurrency(spent)} spent</span>
          <span className="budget-pct" style={{ color: statusColor }}>{pct}%</span>
        </div>
        <div className="budget-track">
          <div className="budget-fill" style={{ width: `${pct}%`, background: barColor, boxShadow: `0 0 8px ${barColor}60` }} />
        </div>
        <div className="budget-limit-row">
          <span style={{ fontSize: "0.75rem" }}>
            {isOver ? <span style={{ color: "#ef4444" }}>Exceeded by {formatCurrency(spent - budget.limit_amount)}</span>
              : <span style={{ color: "var(--slate)" }}>{formatCurrency(remaining)} remaining</span>}
          </span>
          <span style={{ color: "var(--slate-dim)", fontSize: "0.75rem" }}>Limit: {formatCurrency(budget.limit_amount)}</span>
        </div>
      </div>
    </div>
  );
}

// ── MAIN BUDGETS PAGE ──────────────────────────────────────────────────────
export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<Budget | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const { user } = useAuth();
  const { formatAmount: formatCurrency } = useCurrency();

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    const [{ data: budgetData }, { data: txData }] = await Promise.all([
      supabase.from("budgets").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("transactions").select("*").eq("user_id", user.id),
    ]);
    if (budgetData) setBudgets(budgetData);
    if (txData) setTransactions(txData);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [user]);

  const getSpentForCategory = (category: string, month: string) =>
    transactions.filter((t) => t.type === "expense" && t.category === category && t.date.slice(0, 7) === month)
      .reduce((s, t) => s + t.amount, 0);

  const handleSave = async (category: string, limit: number, month: string) => {
    if (!user) return;
    if (editData) {
      const { error } = await supabase.from("budgets").update({ category, limit_amount: limit, month }).eq("id", editData.id);
      if (error) { showToast("Failed to update budget", "error"); return; }
      showToast("Budget updated!", "success");
    } else {
      const { error } = await supabase.from("budgets").insert({ user_id: user.id, category, limit_amount: limit, month });
      if (error) { showToast("Failed to set budget", "error"); return; }
      showToast("Budget set!", "success");
    }
    setShowModal(false);
    setEditData(null);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("budgets").delete().eq("id", id);
    if (error) { showToast("Failed to delete budget", "error"); return; }
    showToast("Budget deleted!", "success");
    setDeleteId(null);
    fetchData();
  };

  const filteredBudgets = budgets.filter((b) => b.month === selectedMonth);
  const existingCategories = filteredBudgets.map((b) => b.category);
  const totalBudgeted = filteredBudgets.reduce((s, b) => s + b.limit_amount, 0);
  const totalSpent = filteredBudgets.reduce((s, b) => s + getSpentForCategory(b.category, b.month), 0);
  const overBudgetCount = filteredBudgets.filter((b) => getSpentForCategory(b.category, b.month) > b.limit_amount).length;

  return (
    <>
      <AppLayout title="Budgets">
        <style>{`
          .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
          .page-header-left h1 { font-family: 'Syne', sans-serif; font-size: 1.4rem; font-weight: 800; }
          .page-header-left p { color: var(--slate); font-size: 0.85rem; margin-top: 2px; }
          .page-header-right { display: flex; align-items: center; gap: 12px; }
          .month-select { background: var(--glass-bg); border: 1px solid var(--glass-border); color: var(--white); padding: 0 14px; height: 40px; border-radius: 10px; font-size: 0.85rem; font-family: 'DM Sans', sans-serif; cursor: pointer; outline: none; }
          .month-select:focus { border-color: var(--emerald); }
          .btn-add { display: flex; align-items: center; gap: 8px; background: var(--emerald); color: #fff; padding: 10px 20px; border-radius: 10px; border: none; font-size: 0.88rem; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; box-shadow: 0 0 20px rgba(16,185,129,0.3); transition: all 0.25s; }
          .btn-add:hover { background: var(--emerald-bright); box-shadow: 0 0 30px rgba(16,185,129,0.5); transform: translateY(-1px); }
          .summary-strip { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 24px; }
          .strip-card { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 14px; padding: 18px 20px; animation: fadeSlideUp 0.5s ease both; }
          .strip-card-label { font-size: 0.75rem; color: var(--slate); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
          .strip-card-value { font-family: 'Syne', sans-serif; font-size: 1.4rem; font-weight: 800; }
          .over-budget-banner { display: flex; align-items: center; gap: 12px; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); border-radius: 12px; padding: 14px 18px; margin-bottom: 20px; color: #f87171; font-size: 0.88rem; font-weight: 500; animation: fadeSlideUp 0.4s ease both; }
          .budget-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
          .budget-card { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 16px; padding: 22px; transition: all 0.3s; animation: fadeSlideUp 0.5s ease both; }
          .budget-card:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.12); }
          .budget-card-over { border-color: rgba(239,68,68,0.2); background: rgba(239,68,68,0.04); }
          .budget-card-warning { border-color: rgba(249,115,22,0.2); background: rgba(249,115,22,0.04); }
          .budget-card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
          .budget-cat-icon { width: 42px; height: 42px; border-radius: 11px; display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 800; flex-shrink: 0; letter-spacing: 0.02em; }
          .budget-card-info { flex: 1; }
          .budget-cat-name { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; }
          .budget-month { font-size: 0.75rem; color: var(--slate-dim); margin-top: 2px; }
          .budget-card-actions { display: flex; gap: 6px; }
          .btn-icon { width: 30px; height: 30px; border-radius: 8px; border: 1px solid var(--glass-border); background: var(--glass-bg); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; color: var(--slate); }
          .btn-icon:hover.edit { border-color: rgba(16,185,129,0.3); color: var(--emerald); background: rgba(16,185,129,0.08); }
          .btn-icon:hover.delete { border-color: rgba(239,68,68,0.3); color: #f87171; background: rgba(239,68,68,0.08); }
          .budget-alert { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 8px; font-size: 0.78rem; font-weight: 600; margin-bottom: 12px; }
          .budget-alert-over { background: rgba(239,68,68,0.1); color: #f87171; border: 1px solid rgba(239,68,68,0.2); }
          .budget-alert-warning { background: rgba(249,115,22,0.1); color: #fb923c; border: 1px solid rgba(249,115,22,0.2); }
          .budget-alert-ok { background: rgba(16,185,129,0.1); color: #34D399; border: 1px solid rgba(16,185,129,0.2); }
          .budget-progress-section { margin-top: 4px; }
          .budget-progress-labels { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
          .budget-spent { font-size: 0.82rem; color: var(--slate); }
          .budget-pct { font-family: 'Syne', sans-serif; font-size: 0.88rem; font-weight: 700; }
          .budget-track { height: 6px; background: rgba(255,255,255,0.06); border-radius: 100px; overflow: hidden; margin-bottom: 8px; }
          .budget-fill { height: 100%; border-radius: 100px; transition: width 1s ease; }
          .budget-limit-row { display: flex; justify-content: space-between; }
          /* MODAL */
          .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.2s ease; }
          .modal { background: #0F172A; border: 1px solid var(--glass-border); border-radius: 20px; padding: 28px; width: 100%; max-width: 460px; max-height: 90vh; overflow-y: auto; animation: slideUp 0.3s ease; }
          .modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
          .modal-title { font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 700; }
          .modal-close { background: none; border: none; color: var(--slate); cursor: pointer; transition: color 0.2s; }
          .modal-close:hover { color: var(--white); }
          .form-group { margin-bottom: 18px; }
          .form-label { font-size: 0.82rem; font-weight: 600; color: var(--slate); letter-spacing: 0.02em; display: block; margin-bottom: 8px; }
          .category-grid { display: flex; flex-wrap: wrap; gap: 8px; }
          .category-chip { display: flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 100px; border: 1px solid var(--glass-border); background: var(--glass-bg); color: var(--slate); font-size: 0.82rem; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
          .category-chip:hover { border-color: var(--chip-color, var(--emerald)); color: var(--white); }
          .category-chip.selected { border-color: var(--chip-color, var(--emerald)); color: var(--white); background: rgba(16,185,129,0.1); }
          .amount-input-wrap { display: flex; align-items: center; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 10px; height: 52px; padding: 0 16px; transition: all 0.2s; }
          .amount-input-wrap:focus-within { border-color: var(--emerald); box-shadow: 0 0 0 3px rgba(16,185,129,0.1); }
          .amount-input-wrap.input-error { border-color: var(--red); }
          .amount-prefix { color: var(--slate); font-size: 1.1rem; font-weight: 600; margin-right: 8px; }
          .amount-input { background: transparent; border: none; outline: none; color: var(--white); font-size: 1.2rem; font-family: 'Syne', sans-serif; font-weight: 700; width: 100%; }
          .text-input { width: 100%; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 10px; padding: 0 14px; height: 44px; color: var(--white); font-size: 0.9rem; font-family: 'DM Sans', sans-serif; outline: none; transition: all 0.2s; }
          .text-input:focus { border-color: var(--emerald); box-shadow: 0 0 0 3px rgba(16,185,129,0.1); }
          .text-input.input-error { border-color: var(--red); }
          .error-msg { color: var(--red); font-size: 0.78rem; margin-top: 6px; }
          .modal-actions { display: flex; gap: 10px; margin-top: 8px; }
          .btn-cancel { flex: 1; padding: 12px; border-radius: 10px; border: 1px solid var(--glass-border); background: transparent; color: var(--white); font-size: 0.9rem; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
          .btn-cancel:hover { background: var(--glass-bg); }
          .btn-save-budget { flex: 2; padding: 12px; border-radius: 10px; border: none; background: var(--emerald); color: #fff; font-size: 0.9rem; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.25s; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 0 20px rgba(16,185,129,0.3); }
          .btn-save-budget:hover:not(:disabled) { background: var(--emerald-bright); }
          .btn-save-budget:disabled { opacity: 0.5; cursor: not-allowed; }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @media (max-width: 768px) {
            .summary-strip { grid-template-columns: 1fr; }
            .page-header { flex-direction: column; align-items: flex-start; }
            .budget-grid { grid-template-columns: 1fr; }
          }
        `}</style>

        <div className="page-header">
          <div className="page-header-left">
            <h1>Budgets</h1>
            <p>Set spending limits and track your progress</p>
          </div>
          <div className="page-header-right">
            <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="month-select" />
            <button className="btn-add" onClick={() => { setEditData(null); setShowModal(true); }}>
              <PlusIcon /> Set Budget
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-state"><div className="spinner" /></div>
        ) : (
          <>
            {filteredBudgets.length > 0 && (
              <div className="summary-strip">
                <div className="strip-card" style={{ animationDelay: "0s" }}>
                  <div className="strip-card-label">Total Budgeted</div>
                  <div className="strip-card-value" style={{ color: "#38BDF8" }}>{formatCurrency(totalBudgeted)}</div>
                </div>
                <div className="strip-card" style={{ animationDelay: "0.1s" }}>
                  <div className="strip-card-label">Total Spent</div>
                  <div className="strip-card-value" style={{ color: totalSpent > totalBudgeted ? "#f87171" : "#34D399" }}>{formatCurrency(totalSpent)}</div>
                </div>
                <div className="strip-card" style={{ animationDelay: "0.2s" }}>
                  <div className="strip-card-label">Remaining</div>
                  <div className="strip-card-value" style={{ color: totalBudgeted - totalSpent >= 0 ? "#34D399" : "#f87171" }}>
                    {formatCurrency(totalBudgeted - totalSpent)}
                  </div>
                </div>
              </div>
            )}

            {overBudgetCount > 0 && (
              <div className="over-budget-banner">
                <AlertIcon /> You have exceeded your budget in <strong>{overBudgetCount}</strong> {overBudgetCount === 1 ? "category" : "categories"} this month!
              </div>
            )}

            {filteredBudgets.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon"><BudgetIcon /></div>
                <div className="empty-title">No budgets set for this month</div>
                <div className="empty-sub">Set spending limits to keep your finances on track</div>
                <button className="btn-add" onClick={() => { setEditData(null); setShowModal(true); }}>
                  <PlusIcon /> Set Your First Budget
                </button>
              </div>
            ) : (
              <div className="budget-grid">
                {filteredBudgets.map((budget, i) => (
                  <div key={budget.id} style={{ animationDelay: `${i * 0.08}s` }}>
                    <BudgetCard
                      budget={budget}
                      spent={getSpentForCategory(budget.category, budget.month)}
                      onEdit={() => { setEditData(budget); setShowModal(true); }}
                      onDelete={() => setDeleteId(budget.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </AppLayout>

      {showModal && (
        <BudgetModal
          onClose={() => { setShowModal(false); setEditData(null); }}
          onSave={handleSave}
          editData={editData}
          existingCategories={existingCategories}
        />
      )}

      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal" style={{ maxWidth: 360 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Delete Budget</div>
              <button className="modal-close" onClick={() => setDeleteId(null)}><XIcon /></button>
            </div>
            <p style={{ color: "var(--slate)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: 24 }}>
              Are you sure you want to delete this budget? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn-save-budget" style={{ background: "#ef4444", boxShadow: "none" }} onClick={() => handleDelete(deleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === "success" ? <CheckCircleIcon /> : <AlertIcon />} {toast.msg}
        </div>
      )}
    </>
  );
}
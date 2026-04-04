import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useCurrency } from "../context/CurrencyContext";
import { supabase } from "../lib/supabase";
import AppLayout from "../components/layout/AppLayout";

// ── TYPES ──────────────────────────────────────────────────────────────────
interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
  created_at: string;
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
const SearchIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const AlertIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const TransactionIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

// ── CONSTANTS ──────────────────────────────────────────────────────────────
const INCOME_CATEGORIES = ["Salary", "Freelance", "Investment", "Gift", "Other"];
const EXPENSE_CATEGORIES = ["Food", "Transport", "Entertainment", "Bills", "Shopping", "Health", "Education", "Other"];
const categoryColors: Record<string, string> = {
  Food: "#10B981", Transport: "#38BDF8", Entertainment: "#A78BFA",
  Bills: "#F97316", Shopping: "#F43F5E", Health: "#34D399",
  Salary: "#10B981", Freelance: "#38BDF8", Investment: "#A78BFA",
  Gift: "#F97316", Education: "#FBBF24", Other: "#94A3B8",
};

// ── ADD/EDIT MODAL ─────────────────────────────────────────────────────────
function TransactionModal({ onClose, onSave, editData }: {
  onClose: () => void;
  onSave: (data: Omit<Transaction, "id" | "created_at">) => Promise<void>;
  editData?: Transaction | null;
}) {
  const [type, setType] = useState<"income" | "expense">(editData?.type || "expense");
  const [amount, setAmount] = useState(editData?.amount?.toString() || "");
  const [category, setCategory] = useState(editData?.category || "");
  const [description, setDescription] = useState(editData?.description || "");
  const [date, setDate] = useState(editData?.date || new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { symbol } = useCurrency();
  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) errs.amount = "Enter a valid amount";
    if (!category) errs.category = "Select a category";
    if (!date) errs.date = "Select a date";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    await onSave({ type, amount: Number(amount), category, description, date, user_id: "" } as any);
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{editData ? "Edit Transaction" : "Add Transaction"}</div>
          <button className="modal-close" onClick={onClose}><XIcon /></button>
        </div>
        <div className="type-toggle">
          <button className={`type-btn ${type === "expense" ? "active-expense" : ""}`} onClick={() => { setType("expense"); setCategory(""); }}>Expense</button>
          <button className={`type-btn ${type === "income" ? "active-income" : ""}`} onClick={() => { setType("income"); setCategory(""); }}>Income</button>
        </div>
        <div className="form-group">
          <label className="form-label">Amount</label>
         <div className={`amount-input-wrap ${errors.amount ? "input-error" : ""}`}>
  <span className="amount-prefix">{symbol}</span>
  <input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="amount-input" min="0" step="0.01" />
</div>
          {errors.amount && <div className="error-msg">{errors.amount}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Category</label>
          <div className="category-grid">
            {categories.map((cat) => {
              const color = categoryColors[cat] || "#94A3B8";
              return (
                <button key={cat} className={`category-chip ${category === cat ? "selected" : ""}`}
                  style={{ "--chip-color": color } as any} onClick={() => setCategory(cat)}>
                  {category === cat && <CheckIcon />}{cat}
                </button>
              );
            })}
          </div>
          {errors.category && <div className="error-msg">{errors.category}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Description <span className="optional">(optional)</span></label>
          <input type="text" placeholder="What was this for?" value={description} onChange={(e) => setDescription(e.target.value)} className="text-input" />
        </div>
        <div className="form-group">
          <label className="form-label">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={`text-input ${errors.date ? "input-error" : ""}`} />
          {errors.date && <div className="error-msg">{errors.date}</div>}
        </div>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className={`btn-save ${type === "income" ? "btn-income" : "btn-expense"}`} onClick={handleSave} disabled={loading}>
            {loading ? <div className="spinner" /> : editData ? "Save Changes" : `Add ${type === "income" ? "Income" : "Expense"}`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── DELETE MODAL ───────────────────────────────────────────────────────────
function DeleteModal({ onClose, onConfirm, loading }: { onClose: () => void; onConfirm: () => void; loading: boolean }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Delete Transaction</div>
          <button className="modal-close" onClick={onClose}><XIcon /></button>
        </div>
        <p style={{ color: "var(--slate)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: 24 }}>
          Are you sure you want to delete this transaction? This action cannot be undone.
        </p>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-delete" onClick={onConfirm} disabled={loading}>
            {loading ? <div className="spinner" /> : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── MAIN TRANSACTIONS PAGE ─────────────────────────────────────────────────
export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<Transaction | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const { user } = useAuth();
  const { formatAmount: formatCurrency } = useCurrency();

  const fetchTransactions = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase.from("transactions").select("*").eq("user_id", user.id).order("date", { ascending: false });
    if (!error && data) setTransactions(data);
    setLoading(false);
  };

  useEffect(() => { fetchTransactions(); }, [user]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".custom-dropdown")) setDropdownOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (data: Omit<Transaction, "id" | "created_at">) => {
    if (!user) return;
    if (editData) {
      const { error } = await supabase.from("transactions").update({ type: data.type, amount: data.amount, category: data.category, description: data.description, date: data.date }).eq("id", editData.id);
      if (error) { showToast("Failed to update transaction", "error"); return; }
      showToast("Transaction updated!", "success");
    } else {
      const { error } = await supabase.from("transactions").insert({ ...data, user_id: user.id });
      if (error) { showToast("Failed to add transaction", "error"); return; }
      showToast("Transaction added!", "success");
    }
    setShowModal(false);
    setEditData(null);
    fetchTransactions();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    const { error } = await supabase.from("transactions").delete().eq("id", deleteId);
    setDeleteLoading(false);
    if (error) { showToast("Failed to delete transaction", "error"); return; }
    setDeleteId(null);
    showToast("Transaction deleted!", "success");
    fetchTransactions();
  };

  const allCategories = [...new Set(transactions.map((t) => t.category))];
  const filtered = transactions.filter((t) => {
    const matchType = filterType === "all" || t.type === filterType;
    const matchCat = filterCategory === "all" || t.category === filterCategory;
    const matchSearch = !search || t.description?.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
    return matchType && matchCat && matchSearch;
  });

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  return (
    <>
      <AppLayout title="Transactions">
        <style>{`
          .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
          .page-header-left h1 { font-family: 'Syne', sans-serif; font-size: 1.4rem; font-weight: 800; }
          .page-header-left p { color: var(--slate); font-size: 0.85rem; margin-top: 2px; }
          .btn-add { display: flex; align-items: center; gap: 8px; background: var(--emerald); color: #fff; padding: 10px 20px; border-radius: 10px; border: none; font-size: 0.88rem; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; box-shadow: 0 0 20px rgba(16,185,129,0.3); transition: all 0.25s; }
          .btn-add:hover { background: var(--emerald-bright); box-shadow: 0 0 30px rgba(16,185,129,0.5); transform: translateY(-1px); }
          .summary-strip { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 24px; }
          .strip-card { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 14px; padding: 18px 20px; animation: fadeSlideUp 0.5s ease both; }
          .strip-card-label { font-size: 0.75rem; color: var(--slate); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
          .strip-card-value { font-family: 'Syne', sans-serif; font-size: 1.4rem; font-weight: 800; }
          .filters-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
          .search-wrap { display: flex; align-items: center; gap: 8px; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 10px; padding: 0 14px; height: 40px; flex: 1; min-width: 200px; transition: all 0.2s; }
          .search-wrap:focus-within { border-color: var(--emerald); box-shadow: 0 0 0 3px rgba(16,185,129,0.1); }
          .search-icon { color: var(--slate-dim); flex-shrink: 0; display: flex; }
          .search-input { background: transparent; border: none; outline: none; color: var(--white); font-size: 0.88rem; font-family: 'DM Sans', sans-serif; width: 100%; }
          .search-input::placeholder { color: var(--slate-dim); }
          .type-tabs { display: flex; gap: 4px; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 10px; padding: 3px; }
          .type-tab { padding: 6px 14px; border-radius: 7px; border: none; background: transparent; color: var(--slate); font-size: 0.82rem; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
          .type-tab.active-all { background: var(--navy-light); color: var(--white); }
          .type-tab.active-income { background: rgba(16,185,129,0.15); color: #34D399; }
          .type-tab.active-expense { background: rgba(248,113,113,0.15); color: #f87171; }
          .transactions-table { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 16px; overflow: hidden; animation: fadeSlideUp 0.5s 0.1s ease both; }
          .table-header { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 120px; padding: 12px 20px; border-bottom: 1px solid var(--glass-border); font-size: 0.72rem; color: var(--slate-dim); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; }
          .table-row { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 120px; padding: 14px 20px; border-bottom: 1px solid rgba(255,255,255,0.04); align-items: center; transition: background 0.2s; }
          .table-row:last-child { border-bottom: none; }
          .table-row:hover { background: rgba(255,255,255,0.02); }
          .table-cell-description { display: flex; align-items: center; gap: 12px; }
          .table-cat-dot { width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 700; }
          .table-desc-name { font-size: 0.88rem; font-weight: 500; }
          .table-desc-cat { font-size: 0.72rem; color: var(--slate-dim); margin-top: 2px; }
          .table-type-badge { display: inline-flex; padding: 3px 10px; border-radius: 100px; font-size: 0.72rem; font-weight: 600; text-transform: capitalize; }
          .badge-income { background: rgba(16,185,129,0.1); color: #34D399; }
          .badge-expense { background: rgba(248,113,113,0.1); color: #f87171; }
          .table-amount { font-family: 'Syne', sans-serif; font-size: 0.9rem; font-weight: 700; }
          .table-date { font-size: 0.82rem; color: var(--slate); }
          .table-actions { display: flex; gap: 8px; justify-content: flex-end; }
          .btn-icon { width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--glass-border); background: var(--glass-bg); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; color: var(--slate); }
          .btn-icon:hover.edit { border-color: rgba(16,185,129,0.3); color: var(--emerald); background: rgba(16,185,129,0.08); }
          .btn-icon:hover.delete { border-color: rgba(239,68,68,0.3); color: #f87171; background: rgba(239,68,68,0.08); }
          /* MODAL */
          .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.2s ease; }
          .modal { background: #0F172A; border: 1px solid var(--glass-border); border-radius: 20px; padding: 28px; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; animation: slideUp 0.3s ease; }
          .modal-sm { max-width: 380px; }
          .modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
          .modal-title { font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 700; }
          .modal-close { background: none; border: none; color: var(--slate); cursor: pointer; transition: color 0.2s; }
          .modal-close:hover { color: var(--white); }
          .type-toggle { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 12px; padding: 4px; margin-bottom: 20px; }
          .type-btn { padding: 10px; border-radius: 9px; border: none; background: transparent; color: var(--slate); font-size: 0.9rem; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.25s; }
          .active-expense { background: rgba(248,113,113,0.15); color: #f87171; }
          .active-income { background: rgba(16,185,129,0.15); color: #34D399; }
          .form-group { margin-bottom: 18px; }
          .form-label { font-size: 0.82rem; font-weight: 600; color: var(--slate); letter-spacing: 0.02em; display: block; margin-bottom: 8px; }
          .optional { color: var(--slate-dim); font-weight: 400; }
          .amount-input-wrap { display: flex; align-items: center; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 10px; height: 52px; padding: 0 16px; transition: all 0.2s; }
          .amount-input-wrap:focus-within { border-color: var(--emerald); box-shadow: 0 0 0 3px rgba(16,185,129,0.1); }
          .amount-input-wrap.input-error { border-color: var(--red); }
          .amount-prefix { color: var(--slate); font-size: 1.1rem; font-weight: 600; margin-right: 8px; }
          .amount-input { background: transparent; border: none; outline: none; color: var(--white); font-size: 1.2rem; font-family: 'Syne', sans-serif; font-weight: 700; width: 100%; }
          .text-input { width: 100%; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 10px; padding: 0 14px; height: 44px; color: var(--white); font-size: 0.9rem; font-family: 'DM Sans', sans-serif; outline: none; transition: all 0.2s; }
          .text-input:focus { border-color: var(--emerald); box-shadow: 0 0 0 3px rgba(16,185,129,0.1); }
          .text-input.input-error { border-color: var(--red); }
          .category-grid { display: flex; flex-wrap: wrap; gap: 8px; }
          .category-chip { display: flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 100px; border: 1px solid var(--glass-border); background: var(--glass-bg); color: var(--slate); font-size: 0.82rem; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
          .category-chip:hover { border-color: var(--chip-color, var(--emerald)); color: var(--white); }
          .category-chip.selected { background: rgba(16,185,129,0.1); border-color: var(--chip-color, var(--emerald)); color: var(--white); }
          .error-msg { color: var(--red); font-size: 0.78rem; margin-top: 6px; }
          .modal-actions { display: flex; gap: 10px; margin-top: 8px; }
          .btn-cancel { flex: 1; padding: 12px; border-radius: 10px; border: 1px solid var(--glass-border); background: transparent; color: var(--white); font-size: 0.9rem; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
          .btn-cancel:hover { background: var(--glass-bg); }
          .btn-save { flex: 2; padding: 12px; border-radius: 10px; border: none; color: #fff; font-size: 0.9rem; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.25s; display: flex; align-items: center; justify-content: center; gap: 8px; }
          .btn-income { background: var(--emerald); box-shadow: 0 0 20px rgba(16,185,129,0.3); }
          .btn-income:hover { background: var(--emerald-bright); }
          .btn-expense { background: #ef4444; box-shadow: 0 0 20px rgba(239,68,68,0.3); }
          .btn-expense:hover { background: #f87171; }
          .btn-delete { flex: 2; padding: 12px; border-radius: 10px; border: none; background: #ef4444; color: #fff; font-size: 0.9rem; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.25s; display: flex; align-items: center; justify-content: center; }
          .btn-delete:hover { background: #f87171; }
          .btn-save:disabled, .btn-delete:disabled { opacity: 0.7; cursor: not-allowed; }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @media (max-width: 768px) {
            .summary-strip { grid-template-columns: 1fr; }
            .table-header { display: none; }
            .table-row { grid-template-columns: 1fr auto; grid-template-rows: auto auto; gap: 4px; }
            .table-cell-description { grid-column: 1; }
            .table-amount { grid-column: 2; grid-row: 1; }
            .table-date { grid-column: 1; font-size: 0.75rem; }
            .table-type { display: none; }
            .table-actions { grid-column: 2; grid-row: 2; }
            .page-header { flex-direction: column; align-items: flex-start; }
            .filters-bar { gap: 8px; }
          }
        `}</style>

        {/* PAGE HEADER */}
        <div className="page-header">
          <div className="page-header-left">
            <h1>Transactions</h1>
            <p>{transactions.length} total transactions</p>
          </div>
          <button className="btn-add" onClick={() => { setEditData(null); setShowModal(true); }}>
            <PlusIcon /> Add Transaction
          </button>
        </div>

        {/* SUMMARY STRIP */}
        <div className="summary-strip">
          <div className="strip-card" style={{ animationDelay: "0s" }}>
            <div className="strip-card-label">Total Income</div>
            <div className="strip-card-value" style={{ color: "#34D399" }}>{formatCurrency(totalIncome)}</div>
          </div>
          <div className="strip-card" style={{ animationDelay: "0.1s" }}>
            <div className="strip-card-label">Total Expenses</div>
            <div className="strip-card-value" style={{ color: "#f87171" }}>{formatCurrency(totalExpenses)}</div>
          </div>
          <div className="strip-card" style={{ animationDelay: "0.2s" }}>
            <div className="strip-card-label">Net Balance</div>
            <div className="strip-card-value" style={{ color: totalIncome - totalExpenses >= 0 ? "#34D399" : "#f87171" }}>
              {formatCurrency(totalIncome - totalExpenses)}
            </div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="filters-bar">
          <div className="search-wrap">
            <span className="search-icon"><SearchIcon /></span>
            <input className="search-input" placeholder="Search transactions..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="type-tabs">
            <button className={`type-tab ${filterType === "all" ? "active-all" : ""}`} onClick={() => setFilterType("all")}>All</button>
            <button className={`type-tab ${filterType === "income" ? "active-income" : ""}`} onClick={() => setFilterType("income")}>Income</button>
            <button className={`type-tab ${filterType === "expense" ? "active-expense" : ""}`} onClick={() => setFilterType("expense")}>Expense</button>
          </div>
          <div style={{ position: "relative" }} className="custom-dropdown">
            <button onClick={() => setDropdownOpen(!dropdownOpen)} style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--white)", padding: "0 14px", height: "40px", borderRadius: "10px", fontSize: "0.85rem", fontFamily: "'DM Sans', sans-serif", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", minWidth: "160px", justifyContent: "space-between" }}>
              {filterCategory === "all" ? "All Categories" : filterCategory}
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {dropdownOpen && (
              <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, background: "#0F172A", border: "1px solid var(--glass-border)", borderRadius: "12px", padding: "6px", zIndex: 50, minWidth: "180px", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}>
                {["all", ...allCategories].map((cat) => (
                  <button key={cat} onClick={() => { setFilterCategory(cat); setDropdownOpen(false); }}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "none", background: filterCategory === cat ? "rgba(16,185,129,0.1)" : "transparent", color: filterCategory === cat ? "var(--emerald)" : "var(--slate)", fontSize: "0.85rem", fontFamily: "'DM Sans', sans-serif", cursor: "pointer", textAlign: "left" }}
                    onMouseEnter={(e) => { if (filterCategory !== cat) { (e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"; (e.target as HTMLButtonElement).style.color = "var(--white)"; } }}
                    onMouseLeave={(e) => { if (filterCategory !== cat) { (e.target as HTMLButtonElement).style.background = "transparent"; (e.target as HTMLButtonElement).style.color = "var(--slate)"; } }}>
                    {cat === "all" ? "All Categories" : cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* TABLE */}
        <div className="transactions-table">
          <div className="table-header">
            <div>Description</div><div>Type</div><div>Amount</div><div>Date</div>
            <div style={{ textAlign: "right" }}>Actions</div>
          </div>
          {loading ? (
            <div className="loading-state"><div className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><TransactionIcon /></div>
              <div className="empty-title">{search || filterType !== "all" || filterCategory !== "all" ? "No matching transactions" : "No transactions yet"}</div>
              <div className="empty-sub">{search || filterType !== "all" || filterCategory !== "all" ? "Try adjusting your filters" : "Add your first transaction to get started"}</div>
              {!search && filterType === "all" && filterCategory === "all" && (
                <button className="btn-add" onClick={() => { setEditData(null); setShowModal(true); }}>
                  <PlusIcon /> Add Transaction
                </button>
              )}
            </div>
          ) : (
            filtered.map((tx) => {
              const color = categoryColors[tx.category] || "#94A3B8";
              const isIncome = tx.type === "income";
              return (
                <div key={tx.id} className="table-row">
                  <div className="table-cell-description">
                    <div className="table-cat-dot" style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>{tx.category.slice(0, 3).toUpperCase()}</div>
                    <div>
                      <div className="table-desc-name">{tx.description || tx.category}</div>
                      <div className="table-desc-cat">{tx.category}</div>
                    </div>
                  </div>
                  <div className="table-type">
                    <span className={`table-type-badge ${isIncome ? "badge-income" : "badge-expense"}`}>{tx.type}</span>
                  </div>
                  <div className="table-amount" style={{ color: isIncome ? "#34D399" : "#f87171" }}>
                    {isIncome ? "+" : "-"}{formatCurrency(tx.amount)}
                  </div>
                  <div className="table-date">{new Date(tx.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                  <div className="table-actions">
                    <button className="btn-icon edit" title="Edit" onClick={() => { setEditData(tx); setShowModal(true); }}><EditIcon /></button>
                    <button className="btn-icon delete" title="Delete" onClick={() => setDeleteId(tx.id)}><TrashIcon /></button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </AppLayout>

      {showModal && <TransactionModal onClose={() => { setShowModal(false); setEditData(null); }} onSave={handleSave} editData={editData} />}
      {deleteId && <DeleteModal onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleteLoading} />}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === "success" ? <CheckIcon /> : <AlertIcon />} {toast.msg}
        </div>
      )}
    </>
  );
}
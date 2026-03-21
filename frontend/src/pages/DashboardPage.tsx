import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCurrency } from "../context/CurrencyContext";
import { supabase } from "../lib/supabase";
import AppLayout from "../components/layout/AppLayout";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";

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
const TransactionIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);
const PlusIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const TrendUpIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>
);
const TrendDownIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>
  </svg>
);

// ── CATEGORY COLORS ────────────────────────────────────────────────────────
const categoryColors: Record<string, string> = {
  Food: "#10B981", Transport: "#38BDF8", Entertainment: "#A78BFA",
  Bills: "#F97316", Shopping: "#F43F5E", Health: "#34D399",
  Salary: "#10B981", Freelance: "#38BDF8", Investment: "#A78BFA",
  Other: "#94A3B8",
};

// ── CUSTOM TOOLTIP ─────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "rgba(15,23,42,0.95)", border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "10px", padding: "12px 16px", fontSize: "0.82rem",
    }}>
      <div style={{ color: "#94A3B8", marginBottom: 6, fontWeight: 600 }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: p.color, display: "flex", gap: 8, alignItems: "center" }}>
          <span>{p.name}:</span>
          <span style={{ fontWeight: 700 }}>{p.value?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

// ── SUMMARY CARD ───────────────────────────────────────────────────────────
function SummaryCard({ title, value, trend, trendLabel, accent, icon }: {
  title: string; value: string; trend: number; trendLabel: string;
  accent: string; icon: React.ReactNode;
}) {
  const isPositive = trend >= 0;
  return (
    <div className="summary-card" style={{ "--accent": accent } as any}>
      <div className="summary-card-top">
        <div className="summary-card-icon" style={{ background: `${accent}18`, border: `1px solid ${accent}30`, color: accent }}>
          {icon}
        </div>
        <div className={`summary-trend ${isPositive ? "trend-up" : "trend-down"}`}>
          {isPositive ? <TrendUpIcon /> : <TrendDownIcon />}
          {Math.abs(trend)}%
        </div>
      </div>
      <div className="summary-card-value">{value}</div>
      <div className="summary-card-title">{title}</div>
      <div className="summary-card-sub">{trendLabel}</div>
    </div>
  );
}

// ── MAIN DASHBOARD ─────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { formatAmount: formatCurrency } = useCurrency();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const fetchTransactions = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("transactions").select("*").eq("user_id", user.id)
        .order("date", { ascending: false });
      if (!error && data) setTransactions(data);
      setLoading(false);
    };
    fetchTransactions();
  }, [user]);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyTransactions = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const lastMonthTransactions = transactions.filter((t) => {
    const d = new Date(t.date);
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    return d.getMonth() === lastMonth && d.getFullYear() === lastYear;
  });

  const monthlyIncome = monthlyTransactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const monthlyExpenses = monthlyTransactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const totalBalance = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0) -
    transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const savingsRate = monthlyIncome > 0 ? Math.round(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100) : 0;

  const lastMonthIncome = lastMonthTransactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const lastMonthExpenses = lastMonthTransactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const incomeTrend = lastMonthIncome > 0 ? Math.round(((monthlyIncome - lastMonthIncome) / lastMonthIncome) * 100) : 0;
  const expenseTrend = lastMonthExpenses > 0 ? Math.round(((monthlyExpenses - lastMonthExpenses) / lastMonthExpenses) * 100) : 0;

  const chartData = Array.from({ length: 6 }, (_, i) => {
    const month = new Date(currentYear, currentMonth - (5 - i), 1);
    const monthName = month.toLocaleString("default", { month: "short" });
    const filtered = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === month.getMonth() && d.getFullYear() === month.getFullYear();
    });
    return {
      month: monthName,
      Income: filtered.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
      Expenses: filtered.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
    };
  });

  const recentTransactions = transactions.slice(0, 6);

  return (
    <AppLayout title="Dashboard">
      <style>{`
        .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
        .summary-card {
          background: var(--glass-bg); border: 1px solid var(--glass-border);
          border-radius: 16px; padding: 22px; transition: all 0.3s;
          animation: fadeSlideUp 0.6s ease both; position: relative; overflow: hidden;
        }
        .summary-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, var(--accent, #10B981), transparent); opacity: 0.5;
        }
        .summary-card:hover { transform: translateY(-3px); border-color: rgba(255,255,255,0.12); box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
        .summary-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .summary-card-icon { width: 42px; height: 42px; border-radius: 11px; display: flex; align-items: center; justify-content: center; }
        .summary-trend { display: flex; align-items: center; gap: 4px; font-size: 0.78rem; font-weight: 600; padding: 4px 8px; border-radius: 100px; }
        .trend-up { background: rgba(16,185,129,0.1); color: #34D399; }
        .trend-down { background: rgba(248,113,113,0.1); color: #f87171; }
        .summary-card-value { font-family: 'Syne', sans-serif; font-size: 1.7rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 4px; }
        .summary-card-title { font-size: 0.82rem; color: var(--slate); font-weight: 500; }
        .summary-card-sub { font-size: 0.75rem; color: var(--slate-dim); margin-top: 2px; }
        .chart-section { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 16px; padding: 24px; margin-bottom: 24px; animation: fadeSlideUp 0.6s 0.2s ease both; }
        .chart-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
        .chart-title { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; }
        .chart-subtitle { font-size: 0.78rem; color: var(--slate); margin-top: 2px; }
        .chart-legend { display: flex; gap: 16px; }
        .chart-legend-item { display: flex; align-items: center; gap: 6px; font-size: 0.78rem; color: var(--slate); }
        .chart-legend-dot { width: 8px; height: 8px; border-radius: 50%; }
        .transactions-section { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 16px; padding: 24px; animation: fadeSlideUp 0.6s 0.3s ease both; }
        .transactions-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .transactions-title { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; }
        .btn-view-all { font-size: 0.8rem; color: var(--emerald); background: none; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 600; transition: color 0.2s; }
        .btn-view-all:hover { color: var(--emerald-bright); }
        .transaction-item { display: flex; align-items: center; gap: 14px; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.04); transition: all 0.2s; }
        .transaction-item:last-child { border-bottom: none; }
        .transaction-item:hover { padding-left: 4px; }
        .transaction-dot { width: 40px; height: 40px; border-radius: 11px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.02em; }
        .transaction-info { flex: 1; min-width: 0; }
        .transaction-name { font-size: 0.88rem; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .transaction-meta { font-size: 0.72rem; color: var(--slate-dim); margin-top: 2px; }
        .transaction-amount { font-family: 'Syne', sans-serif; font-size: 0.92rem; font-weight: 700; }
        .btn-add-transaction { display: flex; align-items: center; gap: 8px; background: var(--emerald); color: #fff; padding: 10px 20px; border-radius: 10px; border: none; font-size: 0.88rem; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; box-shadow: 0 0 20px rgba(16,185,129,0.3); transition: all 0.25s; }
        .btn-add-transaction:hover { background: var(--emerald-bright); box-shadow: 0 0 30px rgba(16,185,129,0.5); transform: translateY(-1px); }
        .empty-state-title { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; margin-bottom: 6px; }
        .empty-state-sub { color: var(--slate); font-size: 0.85rem; margin-bottom: 20px; }
        @media (max-width: 1024px) { .summary-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 768px) { .summary-grid { grid-template-columns: 1fr; } }
      `}</style>

      {/* SUMMARY CARDS */}
      <div className="summary-grid">
        <SummaryCard title="Total Balance" value={formatCurrency(totalBalance)} trend={incomeTrend} trendLabel="vs last month" accent="#10B981" icon={<TransactionIcon />} />
        <SummaryCard title="Monthly Expenses" value={formatCurrency(monthlyExpenses)} trend={-expenseTrend} trendLabel="vs last month" accent="#f87171" icon={<TrendDownIcon />} />
        <SummaryCard title="Savings Rate" value={`${savingsRate}%`} trend={savingsRate} trendLabel="of monthly income" accent="#38BDF8" icon={<TrendUpIcon />} />
      </div>

      {/* CHART */}
      <div className="chart-section">
        <div className="chart-header">
          <div>
            <div className="chart-title">Income vs Expenses</div>
            <div className="chart-subtitle">Last 6 months overview</div>
          </div>
          <div className="chart-legend">
            <div className="chart-legend-item"><div className="chart-legend-dot" style={{ background: "#10B981" }} />Income</div>
            <div className="chart-legend-item"><div className="chart-legend-dot" style={{ background: "#f87171" }} />Expenses</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#475569", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="Income" stroke="#10B981" strokeWidth={2.5} dot={{ fill: "#10B981", r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="Expenses" stroke="#f87171" strokeWidth={2.5} dot={{ fill: "#f87171", r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* RECENT TRANSACTIONS */}
      <div className="transactions-section">
        <div className="transactions-header">
          <div className="transactions-title">Recent Transactions</div>
          <button className="btn-view-all" onClick={() => navigate("/transactions")}>View all →</button>
        </div>
        {loading ? (
          <div className="loading-state"><div className="spinner" /></div>
        ) : recentTransactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><TransactionIcon /></div>
            <div className="empty-state-title">No transactions yet</div>
            <div className="empty-state-sub">Add your first transaction to get started</div>
            <button className="btn-add-transaction" onClick={() => navigate("/transactions")}>
              <PlusIcon /> Add Transaction
            </button>
          </div>
        ) : (
          <>
            {recentTransactions.map((tx) => {
              const color = categoryColors[tx.category] || "#94A3B8";
              const isIncome = tx.type === "income";
              return (
                <div key={tx.id} className="transaction-item">
                  <div className="transaction-dot" style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>
                    {tx.category.slice(0, 3).toUpperCase()}
                  </div>
                  <div className="transaction-info">
                    <div className="transaction-name">{tx.description || tx.category}</div>
                    <div className="transaction-meta">
                      {tx.category} • {new Date(tx.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>
                  </div>
                  <div className="transaction-amount" style={{ color: isIncome ? "#34D399" : "#f87171" }}>
                    {isIncome ? "+" : "-"}{formatCurrency(tx.amount)}
                  </div>
                </div>
              );
            })}
            <div style={{ marginTop: "16px" }}>
              <button className="btn-add-transaction" onClick={() => navigate("/transactions")}>
                <PlusIcon /> Add Transaction
              </button>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
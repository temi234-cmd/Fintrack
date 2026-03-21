import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useCurrency } from "../context/CurrencyContext";
import { supabase } from "../lib/supabase";
import AppLayout from "../components/layout/AppLayout";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
} from "recharts";

// ── TYPES ──────────────────────────────────────────────────────────────────
interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
}

// ── ICONS ──────────────────────────────────────────────────────────────────
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
const AnalyticsIcon = () => (
  <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);

// ── CONSTANTS ──────────────────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  Food: "#10B981", Transport: "#38BDF8", Entertainment: "#A78BFA",
  Bills: "#F97316", Shopping: "#F43F5E", Health: "#34D399",
  Salary: "#10B981", Freelance: "#38BDF8", Investment: "#A78BFA",
  Gift: "#F97316", Education: "#FBBF24", Other: "#94A3B8",
};
const CHART_COLORS = ["#10B981", "#38BDF8", "#A78BFA", "#F97316", "#F43F5E", "#34D399", "#FBBF24", "#94A3B8"];

// ── TOOLTIPS ───────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "rgba(15,23,42,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "12px 16px", fontSize: "0.82rem" }}>
      {label && <div style={{ color: "#94A3B8", marginBottom: 6, fontWeight: 600 }}>{label}</div>}
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: p.color || p.fill, display: "flex", gap: 8, alignItems: "center", marginBottom: 2 }}>
          <span>{p.name}:</span><span style={{ fontWeight: 700 }}>{Number(p.value).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

const PieTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const { name, value, payload: p } = payload[0];
  return (
    <div style={{ background: "rgba(15,23,42,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "10px 14px", fontSize: "0.82rem" }}>
      <div style={{ color: p.color, fontWeight: 700 }}>{name}</div>
      <div style={{ color: "#F8FAFC", marginTop: 2 }}>{Number(value).toLocaleString()} ({p.percent}%)</div>
    </div>
  );
};

// ── MAIN ANALYTICS PAGE ────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"3" | "6" | "12">("6");
  const { user } = useAuth();
  const { formatAmount: formatCurrency } = useCurrency();

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase.from("transactions").select("*").eq("user_id", user.id).order("date", { ascending: false });
      if (data) setTransactions(data);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const months = parseInt(period);

  const monthlyData = Array.from({ length: months }, (_, i) => {
    const month = new Date(currentYear, currentMonth - (months - 1 - i), 1);
    const label = month.toLocaleString("default", { month: "short", year: months > 6 ? "2-digit" : undefined });
    const filtered = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === month.getMonth() && d.getFullYear() === month.getFullYear();
    });
    return {
      month: label,
      Income: filtered.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
      Expenses: filtered.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
    };
  });

  const expensesByCategory = transactions.filter((t) => t.type === "expense").reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const totalExpenses = Object.values(expensesByCategory).reduce((s, v) => s + v, 0);
  const pieData = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1]).map(([name, value], i) => ({
    name, value,
    color: CATEGORY_COLORS[name] || CHART_COLORS[i % CHART_COLORS.length],
    percent: totalExpenses > 0 ? Math.round((value / totalExpenses) * 100) : 0,
  }));

  const incomeByCategory = transactions.filter((t) => t.type === "income").reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);
  const totalIncome = Object.values(incomeByCategory).reduce((s, v) => s + v, 0);

  const currentMonthIncome = transactions.filter((t) => { const d = new Date(t.date); return t.type === "income" && d.getMonth() === currentMonth && d.getFullYear() === currentYear; }).reduce((s, t) => s + t.amount, 0);
  const currentMonthExpenses = transactions.filter((t) => { const d = new Date(t.date); return t.type === "expense" && d.getMonth() === currentMonth && d.getFullYear() === currentYear; }).reduce((s, t) => s + t.amount, 0);
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const lastMonthExpenses = transactions.filter((t) => { const d = new Date(t.date); return t.type === "expense" && d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear; }).reduce((s, t) => s + t.amount, 0);
  const expenseTrend = lastMonthExpenses > 0 ? Math.round(((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100) : 0;
  const savingsRate = currentMonthIncome > 0 ? Math.round(((currentMonthIncome - currentMonthExpenses) / currentMonthIncome) * 100) : 0;
  const avgMonthlyExpense = monthlyData.length > 0 ? Math.round(monthlyData.reduce((s, m) => s + m.Expenses, 0) / monthlyData.length) : 0;
  const topCategory = pieData[0];

  return (
    <AppLayout title="Analytics">
      <style>{`
        .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
        .page-header-left h1 { font-family: 'Syne', sans-serif; font-size: 1.4rem; font-weight: 800; }
        .page-header-left p { color: var(--slate); font-size: 0.85rem; margin-top: 2px; }
        .period-tabs { display: flex; gap: 4px; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 10px; padding: 3px; }
        .period-tab { padding: 6px 16px; border-radius: 7px; border: none; background: transparent; color: var(--slate); font-size: 0.82rem; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
        .period-tab.active { background: var(--navy-light); color: var(--white); }
        .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
        .stat-card { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 14px; padding: 20px; animation: fadeSlideUp 0.5s ease both; transition: all 0.3s; }
        .stat-card:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.12); }
        .stat-card-label { font-size: 0.75rem; color: var(--slate); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
        .stat-card-value { font-family: 'Syne', sans-serif; font-size: 1.4rem; font-weight: 800; margin-bottom: 4px; }
        .stat-card-trend { display: flex; align-items: center; gap: 4px; font-size: 0.75rem; font-weight: 600; }
        .trend-up { color: #34D399; }
        .trend-down { color: #f87171; }
        .charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .chart-card { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 16px; padding: 24px; animation: fadeSlideUp 0.5s ease both; }
        .chart-card-full { grid-column: 1 / -1; }
        .chart-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; }
        .chart-title { font-family: 'Syne', sans-serif; font-size: 0.95rem; font-weight: 700; }
        .chart-subtitle { font-size: 0.75rem; color: var(--slate); margin-top: 3px; }
        .pie-container { display: flex; align-items: center; gap: 24px; }
        .pie-legend { flex: 1; display: flex; flex-direction: column; gap: 10px; }
        .pie-legend-item { display: flex; align-items: center; gap: 10px; }
        .pie-legend-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
        .pie-legend-name { font-size: 0.82rem; color: var(--slate); flex: 1; }
        .pie-legend-value { font-size: 0.82rem; font-weight: 600; }
        .pie-legend-pct { font-size: 0.75rem; color: var(--slate-dim); min-width: 32px; text-align: right; }
        .breakdown-list { display: flex; flex-direction: column; gap: 12px; }
        .breakdown-item { display: flex; flex-direction: column; gap: 6px; }
        .breakdown-item-top { display: flex; align-items: center; justify-content: space-between; }
        .breakdown-item-name { font-size: 0.85rem; font-weight: 500; display: flex; align-items: center; gap: 8px; }
        .breakdown-dot { width: 8px; height: 8px; border-radius: 50%; }
        .breakdown-item-amount { font-size: 0.85rem; font-weight: 700; font-family: 'Syne', sans-serif; }
        .breakdown-item-pct { font-size: 0.72rem; color: var(--slate-dim); }
        .breakdown-bar-track { height: 4px; background: rgba(255,255,255,0.06); border-radius: 100px; overflow: hidden; }
        .breakdown-bar-fill { height: 100%; border-radius: 100px; transition: width 1s ease; }
        .income-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; }
        .income-source-card { background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); border-radius: 12px; padding: 16px; text-align: center; }
        .income-source-name { font-size: 0.75rem; color: var(--slate); margin-bottom: 6px; }
        .income-source-value { font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 700; color: #34D399; }
        .income-source-pct { font-size: 0.72rem; color: var(--slate-dim); margin-top: 2px; }
        @media (max-width: 1024px) { .stat-grid { grid-template-columns: repeat(2, 1fr); } .charts-grid { grid-template-columns: 1fr; } .chart-card-full { grid-column: 1; } }
        @media (max-width: 768px) { .stat-grid { grid-template-columns: 1fr 1fr; } .pie-container { flex-direction: column; } }
        @media (max-width: 480px) { .stat-grid { grid-template-columns: 1fr; } }
      `}</style>

      {loading ? (
        <div className="loading-state"><div className="spinner" /></div>
      ) : transactions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><AnalyticsIcon /></div>
          <div className="empty-title">No data to analyze yet</div>
          <div className="empty-sub">Add some transactions to see your spending analytics</div>
        </div>
      ) : (
        <>
          <div className="page-header">
            <div className="page-header-left">
              <h1>Analytics</h1>
              <p>Track your financial patterns and insights</p>
            </div>
            <div className="period-tabs">
              {(["3", "6", "12"] as const).map((p) => (
                <button key={p} className={`period-tab ${period === p ? "active" : ""}`} onClick={() => setPeriod(p)}>{p}M</button>
              ))}
            </div>
          </div>

          <div className="stat-grid">
            <div className="stat-card" style={{ animationDelay: "0s" }}>
              <div className="stat-card-label">This Month Income</div>
              <div className="stat-card-value" style={{ color: "#34D399" }}>{formatCurrency(currentMonthIncome)}</div>
              <div className="stat-card-trend trend-up"><TrendUpIcon /> Active</div>
            </div>
            <div className="stat-card" style={{ animationDelay: "0.1s" }}>
              <div className="stat-card-label">This Month Expenses</div>
              <div className="stat-card-value" style={{ color: "#f87171" }}>{formatCurrency(currentMonthExpenses)}</div>
              <div className={`stat-card-trend ${expenseTrend <= 0 ? "trend-up" : "trend-down"}`}>
                {expenseTrend <= 0 ? <TrendUpIcon /> : <TrendDownIcon />} {Math.abs(expenseTrend)}% vs last month
              </div>
            </div>
            <div className="stat-card" style={{ animationDelay: "0.2s" }}>
              <div className="stat-card-label">Savings Rate</div>
              <div className="stat-card-value" style={{ color: savingsRate >= 0 ? "#38BDF8" : "#f87171" }}>{savingsRate}%</div>
              <div className="stat-card-trend trend-up"><TrendUpIcon /> of income saved</div>
            </div>
            <div className="stat-card" style={{ animationDelay: "0.3s" }}>
              <div className="stat-card-label">Avg Monthly Expense</div>
              <div className="stat-card-value">{formatCurrency(avgMonthlyExpense)}</div>
              <div className="stat-card-trend" style={{ color: "var(--slate)" }}>over {period} months</div>
            </div>
          </div>

          <div className="charts-grid">
            <div className="chart-card chart-card-full" style={{ animationDelay: "0.1s" }}>
              <div className="chart-header">
                <div>
                  <div className="chart-title">Income vs Expenses</div>
                  <div className="chart-subtitle">Monthly comparison over {period} months</div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#475569", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="Income" stroke="#10B981" strokeWidth={2.5} dot={{ fill: "#10B981", r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="Expenses" stroke="#f87171" strokeWidth={2.5} dot={{ fill: "#f87171", r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card" style={{ animationDelay: "0.2s" }}>
              <div className="chart-header">
                <div><div className="chart-title">Spending by Category</div><div className="chart-subtitle">All time breakdown</div></div>
              </div>
              {pieData.length === 0 ? (
                <div className="empty-state" style={{ padding: "32px" }}><div className="empty-sub">No expense data available</div></div>
              ) : (
                <div className="pie-container">
                  <ResponsiveContainer width={180} height={180}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                        {pieData.map((entry, i) => <Cell key={i} fill={entry.color} stroke="transparent" />)}
                      </Pie>
                      <Tooltip content={<PieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pie-legend">
                    {pieData.slice(0, 6).map((item, i) => (
                      <div key={i} className="pie-legend-item">
                        <div className="pie-legend-dot" style={{ background: item.color }} />
                        <div className="pie-legend-name">{item.name}</div>
                        <div className="pie-legend-value">{formatCurrency(item.value)}</div>
                        <div className="pie-legend-pct">{item.percent}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="chart-card" style={{ animationDelay: "0.3s" }}>
              <div className="chart-header">
                <div><div className="chart-title">Monthly Expenses</div><div className="chart-subtitle">Spending per month</div></div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="Expenses" fill="#f87171" radius={[4, 4, 0, 0]} opacity={0.85} />
                  <Bar dataKey="Income" fill="#10B981" radius={[4, 4, 0, 0]} opacity={0.85} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card" style={{ animationDelay: "0.4s" }}>
              <div className="chart-header">
                <div><div className="chart-title">Expense Breakdown</div><div className="chart-subtitle">By category</div></div>
                {topCategory && (
                  <div style={{ fontSize: "0.75rem", color: "var(--slate)", textAlign: "right" }}>
                    Top: <span style={{ color: topCategory.color, fontWeight: 700 }}>{topCategory.name}</span>
                  </div>
                )}
              </div>
              {pieData.length === 0 ? (
                <div className="empty-state" style={{ padding: "32px" }}><div className="empty-sub">No expense data available</div></div>
              ) : (
                <div className="breakdown-list">
                  {pieData.map((item, i) => (
                    <div key={i} className="breakdown-item">
                      <div className="breakdown-item-top">
                        <div className="breakdown-item-name"><div className="breakdown-dot" style={{ background: item.color }} />{item.name}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div className="breakdown-item-pct">{item.percent}%</div>
                          <div className="breakdown-item-amount">{formatCurrency(item.value)}</div>
                        </div>
                      </div>
                      <div className="breakdown-bar-track">
                        <div className="breakdown-bar-fill" style={{ width: `${item.percent}%`, background: item.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="chart-card chart-card-full" style={{ animationDelay: "0.5s" }}>
              <div className="chart-header">
                <div><div className="chart-title">Income Sources</div><div className="chart-subtitle">Where your money comes from</div></div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#34D399" }}>{formatCurrency(totalIncome)} total</div>
              </div>
              {Object.keys(incomeByCategory).length === 0 ? (
                <div className="empty-state" style={{ padding: "24px" }}><div className="empty-sub">No income data available</div></div>
              ) : (
                <div className="income-grid">
                  {Object.entries(incomeByCategory).sort((a, b) => b[1] - a[1]).map(([cat, amount], i) => (
                    <div key={i} className="income-source-card">
                      <div className="income-source-name">{cat}</div>
                      <div className="income-source-value">{formatCurrency(amount)}</div>
                      <div className="income-source-pct">{totalIncome > 0 ? Math.round((amount / totalIncome) * 100) : 0}% of income</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
}
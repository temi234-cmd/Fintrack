import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const ShieldIcon = () => (
  <svg
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const TrendingUpIcon = () => (
  <svg
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);
const PieChartIcon = () => (
  <svg
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
  >
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
    <path d="M22 12A10 10 0 0 0 12 2v10z" />
  </svg>
);
const BellIcon = () => (
  <svg
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const ArrowRightIcon = () => (
  <svg
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);
const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    viewBox="0 0 24 24"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const SparkleIcon = () => (
  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
  </svg>
);
const MenuIcon = () => (
  <svg
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const XIcon = () => (
  <svg
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// --- ANIMATED COUNTER ---
function useCountUp(
  target: number,
  duration: number = 2000,
  start: boolean = false,
) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

// --- FLOATING ORBS BACKGROUND ---
function FloatingOrbs() {
  return (
    <div className="orbs-container">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="orb orb-4" />
    </div>
  );
}

// --- MOCK DASHBOARD CARD ---
function MockDashboard() {
  const transactions = [
    {
      label: "Netflix",
      cat: "Entertainment",
      amount: "-$15.99",
      color: "#f87171",
    },
    { label: "Salary", cat: "Income", amount: "+$4,200", color: "#10b981" },
    { label: "Groceries", cat: "Food", amount: "-$84.20", color: "#f87171" },
    { label: "Freelance", cat: "Income", amount: "+$850", color: "#10b981" },
  ];

  return (
    <div className="mock-dashboard">
      {/* Top bar */}
      <div className="mock-topbar">
        <div className="mock-logo-dot" />
        <span className="mock-title">FinTrack</span>
        <div className="mock-topbar-dots">
          <span />
          <span />
          <span />
        </div>
      </div>

      {/* Balance card */}
      <div className="mock-balance-card">
        <div className="mock-balance-label">Total Balance</div>
        <div className="mock-balance-value">$12,480.00</div>
        <div className="mock-balance-sub">
          <span className="mock-income">↑ $5,050 income</span>
          <span className="mock-expense">↓ $1,840 expenses</span>
        </div>
        {/* Mini chart bars */}
        <div className="mock-chart-bars">
          {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
            <div
              key={i}
              className="mock-bar"
              style={{ height: `${h}%`, animationDelay: `${i * 0.08}s` }}
            />
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="mock-stats-row">
        <div className="mock-stat-card">
          <div className="mock-stat-label">Income</div>
          <div className="mock-stat-value income">$5,050</div>
        </div>
        <div className="mock-stat-card">
          <div className="mock-stat-label">Expenses</div>
          <div className="mock-stat-value expense">$1,840</div>
        </div>
        <div className="mock-stat-card">
          <div className="mock-stat-label">Saved</div>
          <div className="mock-stat-value saved">63%</div>
        </div>
      </div>

      {/* Transactions */}
      <div className="mock-txns">
        <div className="mock-txns-header">Recent Transactions</div>
        {transactions.map((tx, i) => (
          <div
            key={i}
            className="mock-txn-item"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="mock-txn-dot" style={{ background: tx.color }} />
            <div className="mock-txn-info">
              <span className="mock-txn-label">{tx.label}</span>
              <span className="mock-txn-cat">{tx.cat}</span>
            </div>
            <span className="mock-txn-amount" style={{ color: tx.color }}>
              {tx.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- FEATURE CARD ---
function FeatureCard({
  icon,
  title,
  desc,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  delay: string;
}) {
  return (
    <div className="feature-card" style={{ animationDelay: delay }}>
      <div className="feature-icon-wrap">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-desc">{desc}</p>
    </div>
  );
}

// --- STAT BLOCK ---
function StatBlock({
  value,
  label,
  start,
}: {
  value: number;
  label: string;
  suffix?: string;
  start: boolean;
}) {
  const count = useCountUp(value, 2200, start);
  return (
    <div className="stat-block">
      <div className="stat-value">
        {count.toLocaleString()}
        {value >= 1000 ? "+" : "%"}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

// --- MAIN LANDING PAGE ---
export default function LandingPage() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsVisible(true);
      },
      { threshold: 0.3 },
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: <TrendingUpIcon />,
      title: "Smart Tracking",
      desc: "Automatically categorize income and expenses with intelligent pattern recognition.",
    },
    {
      icon: <PieChartIcon />,
      title: "Deep Analytics",
      desc: "Visualize your spending with beautiful charts and monthly trend reports.",
    },
    {
      icon: <ShieldIcon />,
      title: "Budget Guards",
      desc: "Set limits per category and get instant alerts before you overspend.",
    },
    {
      icon: <BellIcon />,
      title: "AI Insights",
      desc: "Receive personalized financial tips based on your real spending behavior.",
    },
  ];
  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: [
        "Up to 50 transactions/mo",
        "Basic analytics",
        "2 budget categories",
        "CSV export",
      ],
      cta: "Create Free Account",
      route: "/auth",
      highlight: false,
    },
    {
      name: "Pro",
      price: "$9",
      period: "per month",
      features: [
        "Unlimited transactions",
        "Advanced analytics",
        "Unlimited budgets",
        "AI insights",
        "PDF reports",
        "Payment simulation",
      ],
      cta: "Upgrade to Pro",
      route: "/auth",
      highlight: true,
    },
    {
      name: "Team",
      price: "$24",
      period: "per month",
      features: [
        "Everything in Pro",
        "Up to 5 members",
        "Shared budgets",
        "Priority support",
        "Custom categories",
      ],
      cta: "Get Team Access",
      route: "/auth",
      highlight: false,
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --navy: #080E1A;
          --navy-mid: #0F172A;
          --navy-light: #1E293B;
          --emerald: #10B981;
          --emerald-bright: #34D399;
          --emerald-dim: #065F46;
          --slate: #94A3B8;
          --slate-dim: #475569;
          --white: #F8FAFC;
          --glass-bg: rgba(255,255,255,0.04);
          --glass-border: rgba(255,255,255,0.08);
          --glass-hover: rgba(255,255,255,0.07);
          --glow: rgba(16,185,129,0.15);
        }

        html { scroll-behavior: smooth; }

        body {
          background: var(--navy);
          color: var(--white);
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
          line-height: 1.6;
        }

        /* ORBS */
        .orbs-container {
          position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden;
        }
        .orb {
          position: absolute; border-radius: 50%;
          filter: blur(80px); opacity: 0.18;
          animation: drift 20s ease-in-out infinite alternate;
        }
        .orb-1 { width: 600px; height: 600px; background: #10B981; top: -200px; left: -150px; animation-duration: 22s; }
        .orb-2 { width: 500px; height: 500px; background: #0EA5E9; top: 40%; right: -200px; animation-duration: 28s; animation-delay: -8s; }
        .orb-3 { width: 400px; height: 400px; background: #10B981; bottom: -100px; left: 30%; animation-duration: 18s; animation-delay: -4s; }
        .orb-4 { width: 300px; height: 300px; background: #6366F1; top: 20%; left: 45%; animation-duration: 24s; animation-delay: -12s; opacity: 0.10; }

        @keyframes drift {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(40px, 30px) scale(1.08); }
        }

        /* NAVBAR */
        .navbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 0 5%;
          height: 70px;
          display: flex; align-items: center; justify-content: space-between;
          transition: all 0.4s ease;
        }
        .navbar.scrolled {
          background: rgba(8,14,26,0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--glass-border);
        }
        .nav-logo {
          display: flex; align-items: center; gap: 10px;
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: 1.3rem; color: var(--white); text-decoration: none;
        }
        .nav-logo-mark {
          width: 34px; height: 34px; border-radius: 10px;
          background: linear-gradient(135deg, var(--emerald), #0EA5E9);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.9rem; font-weight: 800; color: #fff;
          box-shadow: 0 0 20px rgba(16,185,129,0.4);
        }
        .nav-links {
          display: flex; align-items: center; gap: 36px; list-style: none;
        }
        .nav-links a {
          color: var(--slate); text-decoration: none; font-size: 0.9rem;
          font-weight: 500; letter-spacing: 0.01em;
          transition: color 0.2s;
        }
        .nav-links a:hover { color: var(--white); }
        .nav-cta {
          display: flex; align-items: center; gap: 12px;
        }
        .btn-ghost {
          background: transparent; border: 1px solid var(--glass-border);
          color: var(--white); padding: 8px 20px; border-radius: 8px;
          font-size: 0.88rem; font-weight: 500; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
        }
        .btn-ghost:hover { background: var(--glass-bg); border-color: rgba(255,255,255,0.15); }
        .btn-primary {
          background: var(--emerald); color: #fff;
          padding: 9px 22px; border-radius: 8px; border: none;
          font-size: 0.88rem; font-weight: 600; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          box-shadow: 0 0 20px rgba(16,185,129,0.3);
          transition: all 0.2s;
        }
        .btn-primary:hover { background: var(--emerald-bright); box-shadow: 0 0 30px rgba(16,185,129,0.5); transform: translateY(-1px); }

        .nav-hamburger {
          display: none; background: none; border: none; color: var(--white); cursor: pointer;
        }

        /* MOBILE MENU */
        .mobile-menu {
          display: none; position: fixed; inset: 0; z-index: 99;
          background: rgba(8,14,26,0.97); backdrop-filter: blur(20px);
          flex-direction: column; align-items: center; justify-content: center; gap: 32px;
        }
        .mobile-menu.open { display: flex; }
        .mobile-menu a {
          color: var(--white); text-decoration: none; font-size: 1.5rem;
          font-family: 'Syne', sans-serif; font-weight: 700;
        }

        /* SECTIONS */
        section { position: relative; z-index: 1; }

        /* HERO */
        .hero {
          min-height: 100vh;
          padding: 140px 5% 80px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          max-width: 1280px;
          margin: 0 auto;
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.25);
          color: var(--emerald-bright); padding: 6px 14px; border-radius: 100px;
          font-size: 0.8rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;
          margin-bottom: 24px;
          animation: fadeSlideUp 0.8s ease both;
        }
        .hero-heading {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2.8rem, 5.5vw, 4.2rem);
          font-weight: 800; line-height: 1.08;
          letter-spacing: -0.03em;
          animation: fadeSlideUp 0.8s 0.15s ease both;
        }
        .hero-heading .accent {
          background: linear-gradient(135deg, var(--emerald), #38BDF8);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .hero-sub {
          color: var(--slate); font-size: 1.05rem; line-height: 1.7;
          max-width: 480px; margin-top: 20px;
          animation: fadeSlideUp 0.8s 0.3s ease both;
        }
        .hero-actions {
          display: flex; align-items: center; gap: 16px; margin-top: 36px;
          animation: fadeSlideUp 0.8s 0.45s ease both;
        }
        .btn-hero {
          display: flex; align-items: center; gap: 10px;
          background: var(--emerald); color: #fff;
          padding: 14px 28px; border-radius: 10px; border: none;
          font-size: 0.95rem; font-weight: 600; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          box-shadow: 0 0 40px rgba(16,185,129,0.35);
          transition: all 0.25s;
        }
        .btn-hero:hover { background: var(--emerald-bright); box-shadow: 0 0 60px rgba(16,185,129,0.5); transform: translateY(-2px); }
        .btn-outline {
          display: flex; align-items: center; gap: 8px;
          background: transparent; color: var(--white);
          padding: 14px 28px; border-radius: 10px;
          border: 1px solid var(--glass-border);
          font-size: 0.95rem; font-weight: 500; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.25s;
        }
        .btn-outline:hover { background: var(--glass-bg); border-color: rgba(255,255,255,0.15); }
        .hero-trust {
          display: flex; align-items: center; gap: 10px; margin-top: 32px;
          color: var(--slate-dim); font-size: 0.82rem;
          animation: fadeSlideUp 0.8s 0.6s ease both;
        }
        .trust-avatars {
          display: flex;
        }
        .trust-avatar {
          width: 28px; height: 28px; border-radius: 50%;
          border: 2px solid var(--navy); margin-left: -8px;
          background: linear-gradient(135deg, var(--emerald), #38BDF8);
          font-size: 0.6rem; font-weight: 700; color: #fff;
          display: flex; align-items: center; justify-content: center;
        }
        .trust-avatar:first-child { margin-left: 0; }

        /* HERO VISUAL */
        .hero-visual {
          display: flex; justify-content: center; align-items: center;
          animation: fadeSlideUp 0.8s 0.2s ease both;
        }

        /* MOCK DASHBOARD */
        .mock-dashboard {
          background: rgba(15,23,42,0.8);
          backdrop-filter: blur(24px);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          padding: 20px;
          width: 340px;
          box-shadow: 0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px var(--glass-border), inset 0 1px 0 rgba(255,255,255,0.05);
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .mock-topbar {
          display: flex; align-items: center; gap: 8px; margin-bottom: 16px;
        }
        .mock-logo-dot {
          width: 22px; height: 22px; border-radius: 6px;
          background: linear-gradient(135deg, var(--emerald), #38BDF8);
        }
        .mock-title {
          font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.85rem; flex: 1;
        }
        .mock-topbar-dots { display: flex; gap: 4px; }
        .mock-topbar-dots span {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--glass-border);
        }
        .mock-balance-card {
          background: linear-gradient(135deg, rgba(16,185,129,0.15), rgba(14,165,233,0.1));
          border: 1px solid rgba(16,185,129,0.2);
          border-radius: 14px; padding: 16px; margin-bottom: 12px;
          position: relative; overflow: hidden;
        }
        .mock-balance-label { font-size: 0.7rem; color: var(--slate); letter-spacing: 0.05em; text-transform: uppercase; }
        .mock-balance-value {
          font-family: 'Syne', sans-serif; font-size: 1.6rem; font-weight: 800;
          margin: 4px 0 8px; color: var(--white);
        }
        .mock-balance-sub { display: flex; gap: 12px; font-size: 0.68rem; }
        .mock-income { color: var(--emerald-bright); }
        .mock-expense { color: #f87171; }
        .mock-chart-bars {
          display: flex; align-items: flex-end; gap: 3px;
          height: 36px; margin-top: 12px;
        }
        .mock-bar {
          flex: 1; background: linear-gradient(to top, var(--emerald), rgba(16,185,129,0.3));
          border-radius: 3px 3px 0 0;
          animation: barGrow 1s ease both;
        }
        @keyframes barGrow {
          from { height: 0 !important; }
        }
        .mock-stats-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 12px; }
        .mock-stat-card {
          background: var(--glass-bg); border: 1px solid var(--glass-border);
          border-radius: 10px; padding: 10px 8px;
        }
        .mock-stat-label { font-size: 0.62rem; color: var(--slate); margin-bottom: 3px; }
        .mock-stat-value { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.85rem; }
        .mock-stat-value.income { color: var(--emerald-bright); }
        .mock-stat-value.expense { color: #f87171; }
        .mock-stat-value.saved { color: #38BDF8; }
        .mock-txns-header { font-size: 0.7rem; color: var(--slate); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
        .mock-txn-item {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.04);
          animation: fadeIn 0.5s ease both;
        }
        .mock-txn-item:last-child { border-bottom: none; }
        .mock-txn-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .mock-txn-info { flex: 1; }
        .mock-txn-label { font-size: 0.75rem; font-weight: 500; display: block; }
        .mock-txn-cat { font-size: 0.62rem; color: var(--slate); }
        .mock-txn-amount { font-size: 0.78rem; font-weight: 600; font-family: 'Syne', sans-serif; }

        /* STATS SECTION */
      .stats-section {
  padding: 60px 5%;
  max-width: 1280px; margin: 0 auto;
  overflow: hidden;
}
        .stats-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: var(--glass-border);
          border: 1px solid var(--glass-border);
          border-radius: 16px; overflow: hidden;
        }
        .stat-block {
          background: var(--navy-mid);
          padding: 36px 28px; text-align: center;
          transition: background 0.3s;
        }
        .stat-block:hover { background: var(--glass-bg); }
        .stat-value {
          font-family: 'Syne', sans-serif; font-size: 2.4rem; font-weight: 800;
          background: linear-gradient(135deg, var(--white), var(--emerald-bright));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .stat-label { color: var(--slate); font-size: 0.85rem; margin-top: 4px; }

        /* FEATURES */
        .features-section {
          padding: 100px 5%;
          max-width: 1280px; margin: 0 auto;
        }
        .section-label {
          display: inline-flex; align-items: center; gap: 8px;
          color: var(--emerald); font-size: 0.78rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.1em;
          margin-bottom: 16px;
        }
        .section-heading {
          font-family: 'Syne', sans-serif; font-size: clamp(2rem, 3.5vw, 2.8rem);
          font-weight: 800; letter-spacing: -0.02em; line-height: 1.15;
          max-width: 560px;
        }
        .section-sub {
          color: var(--slate); font-size: 1rem; line-height: 1.7;
          max-width: 480px; margin-top: 12px;
        }
        .features-grid {
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: 16px; margin-top: 60px;
        }
        .feature-card {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 16px; padding: 28px;
          transition: all 0.3s;
          animation: fadeSlideUp 0.8s ease both;
        }
        .feature-card:hover {
          background: var(--glass-hover);
          border-color: rgba(16,185,129,0.2);
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.2), 0 0 0 1px rgba(16,185,129,0.1);
        }
        .feature-icon-wrap {
          width: 44px; height: 44px; border-radius: 12px;
          background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.2);
          display: flex; align-items: center; justify-content: center;
          color: var(--emerald); margin-bottom: 16px;
        }
        .feature-title {
          font-family: 'Syne', sans-serif; font-size: 1.05rem; font-weight: 700;
          margin-bottom: 8px;
        }
        .feature-desc { color: var(--slate); font-size: 0.88rem; line-height: 1.65; }

        /* PRICING */
        .pricing-section {
          padding: 100px 5%;
          max-width: 1280px; margin: 0 auto; text-align: center;
        }
        .pricing-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 20px; margin-top: 60px; text-align: left;
        }
        .pricing-card {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 18px; padding: 32px;
          transition: all 0.3s;
          position: relative;
        }
        .pricing-card:hover { transform: translateY(-4px); }
        .pricing-card.highlighted {
          background: linear-gradient(135deg, rgba(16,185,129,0.08), rgba(14,165,233,0.05));
          border-color: rgba(16,185,129,0.3);
          box-shadow: 0 0 60px rgba(16,185,129,0.1);
        }
        .pricing-badge {
          position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
          background: var(--emerald); color: #fff;
          font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; padding: 4px 14px; border-radius: 100px;
        }
        .pricing-name {
          font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700;
          color: var(--slate); text-transform: uppercase; letter-spacing: 0.08em;
        }
        .pricing-price {
          font-family: 'Syne', sans-serif; font-size: 2.8rem; font-weight: 800;
          margin: 8px 0 4px; line-height: 1;
        }
        .pricing-period { color: var(--slate-dim); font-size: 0.82rem; }
        .pricing-divider {
          border: none; border-top: 1px solid var(--glass-border); margin: 24px 0;
        }
        .pricing-features { list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .pricing-features li {
          display: flex; align-items: center; gap: 10px;
          font-size: 0.88rem; color: var(--slate);
        }
        .pricing-check { color: var(--emerald); flex-shrink: 0; }
        .btn-pricing {
          width: 100%; margin-top: 28px; padding: 13px;
          border-radius: 10px; font-size: 0.9rem; font-weight: 600;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all 0.25s;
        }
        .btn-pricing.outlined {
          background: transparent; color: var(--white);
          border: 1px solid var(--glass-border);
        }
        .btn-pricing.outlined:hover { background: var(--glass-bg); }
        .btn-pricing.filled {
          background: var(--emerald); color: #fff; border: none;
          box-shadow: 0 0 30px rgba(16,185,129,0.3);
        }
        .btn-pricing.filled:hover { background: var(--emerald-bright); box-shadow: 0 0 40px rgba(16,185,129,0.5); }

        /* CTA SECTION */
        .cta-section {
          padding: 100px 5%; max-width: 1280px; margin: 0 auto;
        }
        .cta-box {
          background: linear-gradient(135deg, rgba(16,185,129,0.1), rgba(14,165,233,0.06));
          border: 1px solid rgba(16,185,129,0.2);
          border-radius: 24px; padding: 80px 60px;
          text-align: center;
          position: relative; overflow: hidden;
        }
        .cta-box::before {
          content: ''; position: absolute;
          top: -80px; left: 50%; transform: translateX(-50%);
          width: 400px; height: 400px; border-radius: 50%;
          background: rgba(16,185,129,0.08); filter: blur(60px);
          pointer-events: none;
        }
        .cta-heading {
          font-family: 'Syne', sans-serif; font-size: clamp(2rem, 3.5vw, 2.8rem);
          font-weight: 800; letter-spacing: -0.02em; margin-bottom: 16px;
        }
        .cta-sub { color: var(--slate); font-size: 1rem; max-width: 460px; margin: 0 auto 36px; line-height: 1.7; }

        /* FOOTER */
        footer {
          border-top: 1px solid var(--glass-border);
          padding: 40px 5%;
          max-width: 1280px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 16px;
        }
        .footer-copy { color: var(--slate-dim); font-size: 0.82rem; }
        .footer-links { display: flex; gap: 24px; }
        .footer-links a { color: var(--slate-dim); text-decoration: none; font-size: 0.82rem; transition: color 0.2s; }
        .footer-links a:hover { color: var(--white); }

        /* ANIMATIONS */
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .hero { grid-template-columns: 1fr; text-align: center; padding-top: 120px; }
          .hero-sub, .hero-trust { margin-left: auto; margin-right: auto; justify-content: center; }
          .hero-actions { justify-content: center; }
          .hero-visual { order: -1; }
          .mock-dashboard { width: 300px; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .pricing-grid { grid-template-columns: 1fr; max-width: 440px; margin-left: auto; margin-right: auto; }
          .features-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .nav-links, .nav-cta { display: none; }
          .nav-hamburger { display: block; }
          .hero { gap: 40px; }
          .cta-box { padding: 50px 24px; }
          footer { flex-direction: column; align-items: flex-start; }
        }
       @media (max-width: 480px) {
  .stats-grid { grid-template-columns: 1fr; }
  .hero-actions { flex-direction: column; width: 100%; }
  .btn-hero, .btn-outline { width: 100%; justify-content: center; }
}
      `}</style>

      <FloatingOrbs />

      {/* NAVBAR */}
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <a href="#" className="nav-logo">
          <div className="nav-logo-mark">F</div>
          FinTrack
        </a>
        <ul className="nav-links">
          <li>
            <a href="#features">Features</a>
          </li>
          <li>
            <a href="#pricing">Pricing</a>
          </li>
          <li>
            <a href="#how-it-works">How it works</a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
        </ul>
        <div className="nav-cta">
          <button className="btn-ghost" onClick={() => navigate("/auth")}>
            Log in
          </button>
          <button className="btn-primary" onClick={() => navigate("/auth")}>
            Get Started
          </button>
        </div>
       <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
  <MenuIcon />
</button>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <button
          style={{
            position: "absolute",
            top: 24,
            right: 24,
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
          }}
          onClick={() => setMenuOpen(false)}
        >
          <XIcon />
        </button>
        <a href="#features" onClick={() => setMenuOpen(false)}>
          Features
        </a>
        <a href="#pricing" onClick={() => setMenuOpen(false)}>
          Pricing
        </a>
      <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a>
<a href="#about" onClick={() => setMenuOpen(false)}>About</a>
        <button
          className="btn-primary"
          style={{ fontSize: "1rem", padding: "14px 36px" }}
          onClick={() => {
            navigate("/auth");
            setMenuOpen(false);
          }}
        >
          Get Started
        </button>
      </div>

      {/* HERO */}
      <section>
        <div className="hero">
          <div className="hero-content">
            <div className="hero-badge">
              <SparkleIcon /> Intelligent Finance Tracking
            </div>
            <h1 className="hero-heading">
              Take full control of
              <br />
              your <span className="accent">financial life</span>
            </h1>
            <p className="hero-sub">
              FinTrack gives you a crystal-clear view of your money — track
              spending, set smart budgets, and get AI-powered insights to grow
              your wealth.
            </p>
            <div className="hero-actions">
              <button className="btn-hero" onClick={() => navigate("/auth")}>
                Start for free <ArrowRightIcon />
              </button>
              <button className="btn-outline" onClick={() => navigate("/auth")}>
                See how it works
              </button>
            </div>
            <div className="hero-trust">
              <div className="trust-avatars">
                {["A", "B", "C", "D"].map((l, i) => (
                  <div key={i} className="trust-avatar">
                    {l}
                  </div>
                ))}
              </div>
              <span>
                Trusted by{" "}
                <strong style={{ color: "var(--white)" }}>2,400+</strong> users
                worldwide
              </span>
            </div>
          </div>
          <div className="hero-visual">
            <MockDashboard />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-section" ref={statsRef}>
        <div className="stats-grid">
          <StatBlock value={2400} label="Active Users" start={statsVisible} />
          <StatBlock value={98} label="Uptime %" start={statsVisible} />
          <StatBlock
            value={15000}
            label="Transactions Tracked"
            start={statsVisible}
          />
          <StatBlock
            value={94}
            label="User Satisfaction"
            start={statsVisible}
          />
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section" id="features">
        <div className="section-label">
          <SparkleIcon /> What you get
        </div>
        <h2 className="section-heading">
          Everything your finances need, nothing they don't
        </h2>
        <p className="section-sub">
          Built for people who want clarity, not complexity. Simple tools with
          powerful results.
        </p>
        <div className="features-grid">
          {features.map((f, i) => (
            <FeatureCard key={i} {...f} delay={`${i * 0.1}s`} />
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing-section" id="pricing">
        <div className="section-label" style={{ justifyContent: "center" }}>
          <SparkleIcon /> Pricing
        </div>
        <h2 className="section-heading" style={{ margin: "0 auto" }}>
          Simple, transparent pricing
        </h2>
        <p className="section-sub" style={{ margin: "12px auto 0" }}>
          No hidden fees. No surprises. Pick the plan that fits your life.
        </p>
        <div className="pricing-grid">
          {pricingPlans.map((plan, i) => (
            <div
              key={i}
              className={`pricing-card ${plan.highlight ? "highlighted" : ""}`}
            >
              {plan.highlight && (
                <div className="pricing-badge">Most Popular</div>
              )}
              <div className="pricing-name">{plan.name}</div>
              <div className="pricing-price">{plan.price}</div>
              <div className="pricing-period">{plan.period}</div>
              <hr className="pricing-divider" />
              <ul className="pricing-features">
                {plan.features.map((feat, j) => (
                  <li key={j}>
                    <span className="pricing-check">
                      <CheckIcon />
                    </span>
                    {feat}
                  </li>
                ))}
              </ul>
              <button
                className={`btn-pricing ${plan.highlight ? "filled" : "outlined"}`}
                onClick={() => navigate(plan.route)}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>
      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        style={{ padding: "100px 5%", maxWidth: "1280px", margin: "0 auto" }}
      >
        <div className="section-label">
          <SparkleIcon /> How it works
        </div>
        <h2 className="section-heading">Up and running in 3 steps</h2>
        <p className="section-sub">
          No complicated setup. Start tracking your finances in under 2 minutes.
        </p>

      <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "24px",
    marginTop: "60px",
  }}
>
          {[
            {
              step: "01",
              title: "Create your account",
              desc: "Sign up for free in seconds. No credit card required.",
            },
            {
              step: "02",
              title: "Add your transactions",
              desc: "Log your income and expenses by category and date.",
            },
            {
              step: "03",
              title: "Track & grow",
              desc: "Get insights, set budgets, and watch your savings grow.",
            },
          ].map((item, i) => (
            <div key={i} className="feature-card">
              <div
                style={{
                  fontSize: "2.5rem",
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: "800",
                  background:
                    "linear-gradient(135deg, var(--emerald), #38BDF8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: "16px",
                }}
              >
                {item.step}
              </div>
              <h3 className="feature-title">{item.title}</h3>
              <p className="feature-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        style={{ padding: "100px 5%", maxWidth: "1280px", margin: "0 auto" }}
      >
        <div className="section-label">
          <SparkleIcon /> About
        </div>
        <h2 className="section-heading">
          Built for real people, not accountants
        </h2>
        <p
          className="section-sub"
          style={{ maxWidth: "620px", marginTop: "16px", lineHeight: "1.8" }}
        >
          FinTrack was built because managing money shouldn't require a finance
          degree. We combine smart automation, beautiful design, and AI-powered
          insights to give everyone the tools that used to be reserved for the
          wealthy.
        </p>

      <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "16px",
    marginTop: "48px",
  }}
>
          {[
            {
              title: "Privacy first",
              desc: "Your financial data is encrypted and never sold to third parties.",
            },
            {
              title: "Always improving",
              desc: "We ship new features every week based on real user feedback.",
            },
            {
              title: "Open & honest",
              desc: "No dark patterns, no hidden fees. Just a tool that works for you.",
            },
          ].map((item, i) => (
            <div key={i} className="feature-card">
              <h3 className="feature-title">{item.title}</h3>
              <p className="feature-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* CTA */}
      <section className="cta-section">
        <div className="cta-box">
          <h2 className="cta-heading">Ready to own your finances?</h2>
          <p className="cta-sub">
            Join thousands of users who've taken back control of their money
            with FinTrack.
          </p>
          <button
            className="btn-hero"
            style={{ margin: "0 auto", display: "inline-flex" }}
            onClick={() => navigate("/auth")}
          >
            Create your free account <ArrowRightIcon />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div>
          <a href="#" className="nav-logo" style={{ textDecoration: "none" }}>
            <div className="nav-logo-mark">F</div>
            FinTrack
          </a>
        </div>
        <p className="footer-copy">© 2026 FinTrack. All rights reserved.</p>
        <div className="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Support</a>
        </div>
      </footer>
    </>
  );
}

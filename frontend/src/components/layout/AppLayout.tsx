import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

// ── APP LAYOUT COMPONENT ───────────────────────────────────────────────────
export default function AppLayout({ children, title }: { children: React.ReactNode; title: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          --red: #ef4444;
          --sidebar-w: 260px;
        }

        body {
          background: var(--navy);
          color: var(--white);
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
          line-height: 1.6;
        }

        /* ── LAYOUT ─────────────────────────────────────────────────────── */
        .app-layout { display: flex; min-height: 100vh; }
        .app-main { flex: 1; margin-left: var(--sidebar-w); display: flex; flex-direction: column; min-height: 100vh; transition: margin 0.3s; }
        .app-content { flex: 1; padding: 28px 32px; overflow-y: auto; }

        /* ── SIDEBAR ────────────────────────────────────────────────────── */
        .sidebar {
          position: fixed; left: 0; top: 0; bottom: 0;
          width: var(--sidebar-w);
          background: rgba(8,14,26,0.95);
          backdrop-filter: blur(20px);
          border-right: 1px solid var(--glass-border);
          display: flex; flex-direction: column;
          z-index: 50; transition: transform 0.3s ease;
        }
        .sidebar-overlay {
          display: none; position: fixed; inset: 0;
          background: rgba(0,0,0,0.6); z-index: 49;
          backdrop-filter: blur(4px);
        }
        .sidebar-logo {
          display: flex; align-items: center; gap: 10px;
          padding: 24px 20px; border-bottom: 1px solid var(--glass-border);
        }
        .sidebar-logo-mark {
          width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
          background: linear-gradient(135deg, var(--emerald), #0EA5E9);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1rem; color: #fff;
          box-shadow: 0 0 20px rgba(16,185,129,0.3);
        }
        .sidebar-logo-name { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.2rem; flex: 1; }
        .sidebar-close { display: none; background: none; border: none; color: var(--slate); cursor: pointer; }
        .sidebar-nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 4px; }
        .sidebar-nav-item {
          display: flex; align-items: center; gap: 12px;
          padding: 11px 14px; border-radius: 10px; border: none;
          background: transparent; color: var(--slate);
          font-size: 0.9rem; font-weight: 500; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s; position: relative; width: 100%; text-align: left;
        }
        .sidebar-nav-item:hover { background: var(--glass-bg); color: var(--white); }
        .sidebar-nav-item.active { background: rgba(16,185,129,0.1); color: var(--white); }
        .sidebar-nav-icon { flex-shrink: 0; }
        .sidebar-nav-label { flex: 1; }
        .sidebar-nav-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--emerald); box-shadow: 0 0 8px rgba(16,185,129,0.6);
        }
        .sidebar-footer { padding: 16px 12px; border-top: 1px solid var(--glass-border); display: flex; flex-direction: column; gap: 8px; }
        .sidebar-user { display: flex; align-items: center; gap: 10px; padding: 8px; }
        .sidebar-avatar {
          width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(135deg, var(--emerald), #0EA5E9);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.8rem; font-weight: 700; color: #fff;
        }
        .sidebar-user-name { font-size: 0.88rem; font-weight: 600; }
        .sidebar-user-email { font-size: 0.72rem; color: var(--slate-dim); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px; }
        .sidebar-logout {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px; border-radius: 10px; border: none;
          background: transparent; color: var(--slate);
          font-size: 0.88rem; font-weight: 500; cursor: pointer;
          font-family: 'DM Sans', sans-serif; transition: all 0.2s; width: 100%;
        }
        .sidebar-logout:hover { background: rgba(239,68,68,0.08); color: #f87171; }

        /* ── TOPBAR ─────────────────────────────────────────────────────── */
        .topbar {
          height: 70px; padding: 0 32px;
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(8,14,26,0.8); backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--glass-border);
          position: sticky; top: 0; z-index: 40;
        }
        .topbar-left { display: flex; align-items: center; gap: 16px; }
        .topbar-menu-btn {
          display: none; background: none; border: none;
          color: var(--white); cursor: pointer; padding: 6px;
          border-radius: 8px; transition: background 0.2s;
        }
        .topbar-menu-btn:hover { background: var(--glass-bg); }
        .topbar-greeting { font-size: 0.78rem; color: var(--slate); }
        .topbar-title { font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 700; }
        .topbar-right { display: flex; align-items: center; gap: 16px; }
        .topbar-icon-btn {
          width: 38px; height: 38px; border-radius: 10px;
          border: 1px solid var(--glass-border);
          background: var(--glass-bg); color: var(--slate);
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .topbar-icon-btn:hover { background: rgba(255,255,255,0.07); color: var(--white); }
        .topbar-date { font-size: 0.82rem; color: var(--slate-dim); }

        /* ── SHARED ANIMATIONS ──────────────────────────────────────────── */
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── SHARED COMPONENTS ──────────────────────────────────────────── */
        .spinner {
          width: 28px; height: 28px; border-radius: 50%;
          border: 3px solid rgba(16,185,129,0.2);
          border-top-color: var(--emerald);
          animation: spin 0.8s linear infinite; flex-shrink: 0;
        }
        .loading-state { display: flex; align-items: center; justify-content: center; padding: 64px; }
        .empty-state { text-align: center; padding: 64px 24px; }
        .empty-state-icon { margin-bottom: 16px; color: var(--slate-dim); display: flex; justify-content: center; }
        .empty-title { font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 700; margin-bottom: 8px; }
        .empty-sub { color: var(--slate); font-size: 0.88rem; margin-bottom: 24px; }
        .toast {
          position: fixed; bottom: 24px; right: 24px; z-index: 200;
          padding: 12px 20px; border-radius: 10px;
          font-size: 0.88rem; font-weight: 500;
          animation: slideUp 0.3s ease;
          display: flex; align-items: center; gap: 8px;
        }
        .toast-success { background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3); color: #34D399; }
        .toast-error { background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3); color: #f87171; }

        /* ── RESPONSIVE ─────────────────────────────────────────────────── */
        @media (max-width: 768px) {
          .sidebar { transform: translateX(-100%); }
          .sidebar.sidebar-open { transform: translateX(0); }
          .sidebar-overlay { display: block; }
          .sidebar-close { display: block; }
          .app-main { margin-left: 0; }
          .topbar-menu-btn { display: flex; }
          .topbar { padding: 0 20px; }
          .app-content { padding: 20px 16px; }
          .topbar-date { display: none; }
        }
      `}</style>

      <div className="app-layout">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="app-main">
          <Topbar onMenuClick={() => setSidebarOpen(true)} title={title} />
          <div className="app-content">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
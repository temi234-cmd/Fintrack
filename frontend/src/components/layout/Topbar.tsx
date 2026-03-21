import { useAuth } from "../../context/AuthContext";

// ── ICONS ──────────────────────────────────────────────────────────────────
const MenuIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
const BellIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

// ── TOPBAR COMPONENT ───────────────────────────────────────────────────────
export default function Topbar({ onMenuClick, title }: { onMenuClick: () => void; title: string }) {
  const { user } = useAuth();
  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "there";

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="topbar-menu-btn" onClick={onMenuClick}>
          <MenuIcon />
        </button>
        <div>
          <div className="topbar-greeting">{getGreeting()}, {firstName}</div>
          <div className="topbar-title">{title}</div>
        </div>
      </div>
      <div className="topbar-right">
        <button className="topbar-icon-btn"><BellIcon /></button>
        <div className="topbar-date">
          {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
        </div>
      </div>
    </header>
  );
}
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCurrency, CURRENCIES } from "../context/CurrencyContext";
import AppLayout from "../components/layout/AppLayout";

// ── ICONS ──────────────────────────────────────────────────────────────────
const CheckIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

// ── MAIN SETTINGS PAGE ─────────────────────────────────────────────────────
export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const { user } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const [selectedCurrency, setSelectedCurrency] = useState(currency);

  const handleSave = async () => {
    await setCurrency(selectedCurrency);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "User";
  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : firstName[0].toUpperCase();

  return (
    <>
      <AppLayout title="Settings">
        <style>{`
          .settings-section { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 16px; padding: 28px; margin-bottom: 20px; animation: fadeSlideUp 0.5s ease both; max-width: 720px; }
          .settings-section-title { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; margin-bottom: 4px; }
          .settings-section-sub { color: var(--slate); font-size: 0.82rem; margin-bottom: 24px; }
          .profile-card { display: flex; align-items: center; gap: 16px; }
          .profile-avatar { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, var(--emerald), #0EA5E9); display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.2rem; color: #fff; flex-shrink: 0; }
          .profile-name { font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 700; }
          .profile-email { color: var(--slate); font-size: 0.85rem; margin-top: 2px; }
          .currency-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 10px; }
          .currency-option { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 11px; border: 1px solid var(--glass-border); background: var(--glass-bg); cursor: pointer; transition: all 0.2s; }
          .currency-option:hover { border-color: rgba(16,185,129,0.3); background: rgba(16,185,129,0.04); }
          .currency-option.selected { border-color: var(--emerald); background: rgba(16,185,129,0.08); }
          .currency-symbol { width: 36px; height: 36px; border-radius: 9px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1rem; flex-shrink: 0; }
          .currency-info { flex: 1; min-width: 0; }
          .currency-code { font-size: 0.88rem; font-weight: 700; }
          .currency-name { font-size: 0.72rem; color: var(--slate-dim); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          .currency-check { color: var(--emerald); flex-shrink: 0; }
          .btn-save { display: flex; align-items: center; gap: 8px; background: var(--emerald); color: #fff; padding: 11px 24px; border-radius: 10px; border: none; font-size: 0.9rem; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; box-shadow: 0 0 20px rgba(16,185,129,0.3); transition: all 0.25s; margin-top: 24px; }
          .btn-save:hover { background: var(--emerald-bright); transform: translateY(-1px); }
          .btn-save.saved { background: #065F46; box-shadow: none; }
          @media (max-width: 768px) {
            .settings-section { padding: 20px 16px; max-width: 100%; }
            .profile-card { flex-direction: column; align-items: flex-start; }
            .btn-save { width: 100%; justify-content: center; }
            .currency-grid { grid-template-columns: 1fr 1fr; }
          }
          @media (max-width: 480px) {
            .currency-grid { grid-template-columns: 1fr; }
          }
        `}</style>

        {/* PROFILE */}
        <div className="settings-section" style={{ animationDelay: "0s" }}>
          <div className="settings-section-title">Profile</div>
          <div className="settings-section-sub">Your account information</div>
          <div className="profile-card">
            <div className="profile-avatar">{initials}</div>
            <div>
              <div className="profile-name">{user?.user_metadata?.full_name || firstName}</div>
              <div className="profile-email">{user?.email}</div>
            </div>
          </div>
        </div>

        {/* CURRENCY */}
        <div className="settings-section" style={{ animationDelay: "0.1s" }}>
          <div className="settings-section-title">Currency</div>
          <div className="settings-section-sub">Choose the currency used across your dashboard</div>
          <div className="currency-grid">
            {CURRENCIES.map((c) => (
              <div
                key={c.code}
                className={`currency-option ${selectedCurrency === c.code ? "selected" : ""}`}
                onClick={() => setSelectedCurrency(c.code)}
              >
                <div className="currency-symbol" style={{ color: selectedCurrency === c.code ? "var(--emerald)" : "var(--slate)" }}>
                  {c.symbol}
                </div>
                <div className="currency-info">
                  <div className="currency-code">{c.code}</div>
                  <div className="currency-name">{c.name}</div>
                </div>
                {selectedCurrency === c.code && <div className="currency-check"><CheckIcon /></div>}
              </div>
            ))}
          </div>
          <button className={`btn-save ${saved ? "saved" : ""}`} onClick={handleSave}>
            {saved ? <><CheckIcon /> Saved!</> : "Save Changes"}
          </button>
        </div>
      </AppLayout>

      {saved && (
        <div className="toast toast-success">
          <CheckIcon /> Currency updated successfully!
        </div>
      )}
    </>
  );
}
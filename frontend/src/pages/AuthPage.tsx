import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext'
import { useLocation } from 'react-router-dom'
// ── ICONS ──────────────────────────────────────────────────────────────────
const EyeIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOffIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const MailIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const LockIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const UserIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const ArrowRightIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);
const ArrowLeftIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);
const CheckCircleIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const AlertIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

// ── FLOATING ORBS ─────────────────────────────────────────────────────────
function FloatingOrbs() {
  return (
    <div className="auth-orbs">
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />
      <div className="auth-orb auth-orb-3" />
    </div>
  );
}

// ── FEATURE LIST (left panel) ──────────────────────────────────────────────
const panelFeatures = [
  { icon: "📊", text: "Real-time spending analytics" },
  { icon: "🎯", text: "Smart budget tracking" },
  { icon: "🤖", text: "AI-powered financial insights" },
  { icon: "🔒", text: "Bank-level security" },
];

// ── INPUT FIELD ────────────────────────────────────────────────────────────
function InputField({
  label,
  type,
  placeholder,
  value,
  onChange,
  icon,
  error,
  rightElement,
}: {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ReactNode;
  error?: string;
  rightElement?: React.ReactNode;
}) {
  return (
    <div className="field-wrap">
      <label className="field-label">{label}</label>
      <div className={`field-input-wrap ${error ? "field-error" : ""}`}>
        <span className="field-icon">{icon}</span>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="field-input"
          autoComplete="off"
        />
        {rightElement && <span className="field-right">{rightElement}</span>}
      </div>
      {error && (
        <div className="field-error-msg">
          <AlertIcon /> {error}
        </div>
      )}
    </div>
  );
}

// ── PASSWORD STRENGTH ──────────────────────────────────────────────────────
function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const strength = checks.filter(Boolean).length;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#ef4444", "#f97316", "#eab308", "#10b981"];

  return (
    <div className="strength-wrap">
      <div className="strength-bars">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="strength-bar"
            style={{ background: i <= strength ? colors[strength] : "rgba(255,255,255,0.08)" }}
          />
        ))}
      </div>
      <span className="strength-label" style={{ color: colors[strength] }}>
        {labels[strength]}
      </span>
    </div>
  );
}

// ── MAIN AUTH PAGE ─────────────────────────────────────────────────────────
export default function AuthPage() {
  const navigate = useNavigate()
  const { signIn, signUp, signInWithGoogle } = useAuth()
  const [tab, setTab] = useState<"login" | "signup">("login")
const location = useLocation()
const isVerified = new URLSearchParams(location.search).get('verified')
const isExpired = new URLSearchParams(location.search).get('error') === 'link_expired'
  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginShowPw, setLoginShowPw] = useState(false);
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Signup state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [signupShowPw, setSignupShowPw] = useState(false);
  const [signupShowConfirm, setSignupShowConfirm] = useState(false);
  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({});
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // ── VALIDATION ────────────────────────────────────────────────────────
  const validateLogin = () => {
    const errs: Record<string, string> = {};
    if (!loginEmail) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(loginEmail)) errs.email = "Enter a valid email";
    if (!loginPassword) errs.password = "Password is required";
    else if (loginPassword.length < 6) errs.password = "Password must be at least 6 characters";
    setLoginErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateSignup = () => {
    const errs: Record<string, string> = {};
    if (!signupName.trim()) errs.name = "Full name is required";
    if (!signupEmail) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(signupEmail)) errs.email = "Enter a valid email";
    if (!signupPassword) errs.password = "Password is required";
    else if (signupPassword.length < 8) errs.password = "Password must be at least 8 characters";
    if (!signupConfirm) errs.confirm = "Please confirm your password";
    else if (signupPassword !== signupConfirm) errs.confirm = "Passwords do not match";
    if (!agreedToTerms) errs.terms = "You must agree to the terms";
    setSignupErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── HANDLERS ──────────────────────────────────────────────────────────
  const handleLogin = async () => {
  if (!validateLogin()) return
  setLoginLoading(true)
  const { error } = await signIn(loginEmail, loginPassword)
  setLoginLoading(false)
  if (error) {
    setLoginErrors({ password: error })
    return
  }
  setLoginSuccess(true)
  setTimeout(() => navigate('/dashboard'), 1200)
}
const handleSignup = async () => {
  if (!validateSignup()) return
  setSignupLoading(true)
  const { error } = await signUp(signupEmail, signupPassword, signupName)
  setSignupLoading(false)
  if (error) {
    setSignupErrors({ email: error })
    return
  }
  // Don't redirect — show verify email message instead
  setSignupSuccess(true)
}
  const switchTab = (t: "login" | "signup") => {
    setTab(t);
    setLoginErrors({});
    setSignupErrors({});
    setLoginSuccess(false);
    setSignupSuccess(false);
  };

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
          --slate: #94A3B8;
          --slate-dim: #475569;
          --white: #F8FAFC;
          --glass-bg: rgba(255,255,255,0.04);
          --glass-border: rgba(255,255,255,0.08);
          --red: #ef4444;
        }

        body {
          background: var(--navy);
          color: var(--white);
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* ORBS */
        .auth-orbs { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
        .auth-orb { position: absolute; border-radius: 50%; filter: blur(90px); }
        .auth-orb-1 { width: 500px; height: 500px; background: rgba(16,185,129,0.12); top: -150px; left: -100px; }
        .auth-orb-2 { width: 400px; height: 400px; background: rgba(14,165,233,0.1); bottom: -100px; right: -100px; }
        .auth-orb-3 { width: 300px; height: 300px; background: rgba(99,102,241,0.08); top: 50%; left: 50%; transform: translate(-50%,-50%); }

        /* PAGE LAYOUT */
        .auth-page {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          position: relative;
          z-index: 1;
        }

        /* LEFT PANEL */
        .auth-left {
          background: linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(14,165,233,0.05) 100%);
          border-right: 1px solid var(--glass-border);
          padding: 60px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }
        .auth-left::before {
          content: '';
          position: absolute;
          top: -100px; left: -100px;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: rgba(16,185,129,0.06);
          filter: blur(60px);
        }
        .auth-brand {
          display: flex; align-items: center; gap: 12px;
          text-decoration: none;
        }
        .auth-brand-mark {
          width: 40px; height: 40px; border-radius: 12px;
          background: linear-gradient(135deg, var(--emerald), #0EA5E9);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: 1.1rem; color: #fff;
          box-shadow: 0 0 24px rgba(16,185,129,0.4);
        }
        .auth-brand-name {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: 1.4rem; color: var(--white);
        }
        .auth-left-content { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 40px 0; }
        .auth-left-heading {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.8rem, 2.5vw, 2.4rem);
          font-weight: 800; line-height: 1.15;
          letter-spacing: -0.02em; margin-bottom: 16px;
        }
        .auth-left-heading .accent {
          background: linear-gradient(135deg, var(--emerald), #38BDF8);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .auth-left-sub {
          color: var(--slate); font-size: 0.95rem; line-height: 1.7;
          margin-bottom: 40px; max-width: 340px;
        }
        .auth-features { display: flex; flex-direction: column; gap: 16px; }
        .auth-feature-item {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 16px;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          transition: all 0.3s;
          animation: fadeSlideUp 0.6s ease both;
        }
        .auth-feature-item:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(16,185,129,0.2);
          transform: translateX(4px);
        }
        .auth-feature-emoji { font-size: 1.2rem; }
        .auth-feature-text { font-size: 0.88rem; color: var(--slate); font-weight: 500; }
        .auth-left-footer { color: var(--slate-dim); font-size: 0.78rem; }

        /* RIGHT PANEL */
        .auth-right {
          display: flex; align-items: center; justify-content: center;
          padding: 60px 40px;
          background: rgba(8,14,26,0.6);
        }
        .auth-card {
          width: 100%; max-width: 420px;
          animation: fadeSlideUp 0.7s ease both;
        }

        /* BACK LINK */
        .auth-back {
          display: inline-flex; align-items: center; gap: 8px;
          color: var(--slate); font-size: 0.82rem; font-weight: 500;
          text-decoration: none; margin-bottom: 32px;
          cursor: pointer; background: none; border: none;
          transition: color 0.2s;
        }
        .auth-back:hover { color: var(--white); }

        /* TAB SWITCHER */
        .auth-tabs {
          display: grid; grid-template-columns: 1fr 1fr;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 12px; padding: 4px;
          margin-bottom: 32px;
        }
        .auth-tab {
          padding: 10px; border-radius: 9px; border: none;
          font-size: 0.9rem; font-weight: 600; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.25s;
          color: var(--slate); background: transparent;
        }
        .auth-tab.active {
          background: var(--emerald);
          color: #fff;
          box-shadow: 0 0 20px rgba(16,185,129,0.3);
        }

        /* HEADING */
        .auth-heading {
          font-family: 'Syne', sans-serif;
          font-size: 1.6rem; font-weight: 800;
          letter-spacing: -0.02em; margin-bottom: 6px;
        }
        .auth-subheading {
          color: var(--slate); font-size: 0.88rem;
          margin-bottom: 28px; line-height: 1.5;
        }

        /* GOOGLE BUTTON */
        .btn-google {
          width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px;
          padding: 12px; border-radius: 10px;
          background: var(--glass-bg); border: 1px solid var(--glass-border);
          color: var(--white); font-size: 0.9rem; font-weight: 500;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all 0.25s; margin-bottom: 24px;
        }
        .btn-google:hover { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.15); }

        /* DIVIDER */
        .auth-divider {
          display: flex; align-items: center; gap: 12px; margin-bottom: 24px;
        }
        .auth-divider-line { flex: 1; height: 1px; background: var(--glass-border); }
        .auth-divider-text { color: var(--slate-dim); font-size: 0.78rem; white-space: nowrap; }

        /* FORM */
        .auth-form { display: flex; flex-direction: column; gap: 16px; }

        /* FIELDS */
        .field-wrap { display: flex; flex-direction: column; gap: 6px; }
        .field-label { font-size: 0.82rem; font-weight: 600; color: var(--slate); letter-spacing: 0.02em; }
        .field-input-wrap {
          display: flex; align-items: center; gap: 10px;
          background: var(--glass-bg); border: 1px solid var(--glass-border);
          border-radius: 10px; padding: 0 14px; height: 48px;
          transition: all 0.2s;
        }
        .field-input-wrap:focus-within {
          border-color: var(--emerald);
          box-shadow: 0 0 0 3px rgba(16,185,129,0.1);
          background: rgba(16,185,129,0.04);
        }
        .field-input-wrap.field-error { border-color: var(--red); box-shadow: 0 0 0 3px rgba(239,68,68,0.1); }
        .field-icon { color: var(--slate-dim); flex-shrink: 0; display: flex; }
        .field-input {
          flex: 1; background: transparent; border: none; outline: none;
          color: var(--white); font-size: 0.9rem; font-family: 'DM Sans', sans-serif;
        }
        .field-input::placeholder { color: var(--slate-dim); }
        .field-right { color: var(--slate-dim); cursor: pointer; display: flex; transition: color 0.2s; }
        .field-right:hover { color: var(--white); }
        .field-error-msg {
          display: flex; align-items: center; gap: 6px;
          color: var(--red); font-size: 0.78rem;
        }

        /* PASSWORD STRENGTH */
        .strength-wrap { display: flex; align-items: center; gap: 10px; margin-top: 4px; }
        .strength-bars { display: flex; gap: 4px; flex: 1; }
        .strength-bar { height: 3px; flex: 1; border-radius: 100px; transition: background 0.3s; }
        .strength-label { font-size: 0.75rem; font-weight: 600; min-width: 40px; }

        /* FORGOT PASSWORD */
        .auth-forgot {
          text-align: right; margin-top: -8px;
        }
        .auth-forgot button {
          background: none; border: none; color: var(--emerald);
          font-size: 0.8rem; cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: color 0.2s;
        }
        .auth-forgot button:hover { color: var(--emerald-bright); }

        /* TERMS */
        .terms-wrap {
          display: flex; align-items: flex-start; gap: 10px;
          font-size: 0.82rem; color: var(--slate);
        }
        .terms-checkbox {
          width: 18px; height: 18px; border-radius: 5px;
          border: 1px solid var(--glass-border);
          background: var(--glass-bg);
          cursor: pointer; flex-shrink: 0; margin-top: 1px;
          appearance: none; -webkit-appearance: none;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .terms-checkbox:checked {
          background: var(--emerald);
          border-color: var(--emerald);
          background-image: url("data:image/svg+xml,%3Csvg width='12' height='12' fill='none' stroke='white' strokeWidth='2.5' viewBox='0 0 24 24'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: center;
        }
        .terms-error { color: var(--red); font-size: 0.78rem; }
        .terms-link { color: var(--emerald); text-decoration: none; }
        .terms-link:hover { color: var(--emerald-bright); }

        /* SUBMIT BUTTON */
        .btn-submit {
          width: 100%; padding: 14px;
          background: var(--emerald); color: #fff;
          border: none; border-radius: 10px;
          font-size: 0.95rem; font-weight: 600; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          box-shadow: 0 0 30px rgba(16,185,129,0.3);
          transition: all 0.25s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          margin-top: 4px;
        }
        .btn-submit:hover:not(:disabled) {
          background: var(--emerald-bright);
          box-shadow: 0 0 50px rgba(16,185,129,0.5);
          transform: translateY(-1px);
        }
        .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        .btn-submit.success { background: #065F46; box-shadow: none; }

        /* LOADING SPINNER */
        .spinner {
          width: 18px; height: 18px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* SWITCH TEXT */
        .auth-switch {
          text-align: center; margin-top: 20px;
          font-size: 0.85rem; color: var(--slate);
        }
        .auth-switch button {
          background: none; border: none; color: var(--emerald);
          font-weight: 600; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.2s;
        }
        .auth-switch button:hover { color: var(--emerald-bright); }

        /* SUCCESS STATE */
        .success-box {
          text-align: center; padding: 40px 20px;
          animation: fadeSlideUp 0.5s ease both;
        }
        .success-icon {
          width: 64px; height: 64px; border-radius: 50%;
          background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3);
          display: flex; align-items: center; justify-content: center;
          color: var(--emerald); margin: 0 auto 20px;
        }
        .success-title {
          font-family: 'Syne', sans-serif; font-size: 1.4rem;
          font-weight: 800; margin-bottom: 8px;
        }
        .success-sub { color: var(--slate); font-size: 0.88rem; line-height: 1.6; }

        /* ANIMATIONS */
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .auth-page { grid-template-columns: 1fr; }
          .auth-left { display: none; }
          .auth-right { padding: 40px 24px; align-items: flex-start; padding-top: 60px; }
          .auth-card { max-width: 100%; }
        }
      `}</style>

      <FloatingOrbs />

      <div className="auth-page">
        {/* ── LEFT PANEL ─────────────────────────────────────── */}
        <div className="auth-left">
          <a href="/" className="auth-brand">
            <div className="auth-brand-mark">F</div>
            <span className="auth-brand-name">FinTrack</span>
          </a>

          <div className="auth-left-content">
            <h2 className="auth-left-heading">
              Your money,<br />
              <span className="accent">finally under control</span>
            </h2>
            <p className="auth-left-sub">
              Join thousands of users who've taken charge of their finances with
              smart tracking and AI-powered insights.
            </p>

            <div className="auth-features">
              {panelFeatures.map((f, i) => (
                <div
                  key={i}
                  className="auth-feature-item"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <span className="auth-feature-emoji">{f.icon}</span>
                  <span className="auth-feature-text">{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="auth-left-footer">
            © 2026 FinTrack. All rights reserved.
          </div>
        </div>

        {/* ── RIGHT PANEL ────────────────────────────────────── */}
        <div className="auth-right">
          <div className="auth-card">

            {/* Back to home */}
            <button className="auth-back" onClick={() => navigate("/")}>
              <ArrowLeftIcon /> Back to home
            </button>

            {/* Tab switcher */}
              {isVerified && (
  <div style={{
    background: 'rgba(16,185,129,0.1)',
    border: '1px solid rgba(16,185,129,0.3)',
    borderRadius: '10px',
    padding: '12px 16px',
    marginBottom: '20px',
    color: '#34D399',
    fontSize: '0.88rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }}>
    <CheckCircleIcon /> Email verified! You can now log in.
  </div>
)}
  {isExpired && (
  <div style={{
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: '10px',
    padding: '12px 16px',
    marginBottom: '20px',
    color: '#f87171',
    fontSize: '0.88rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }}>
   <AlertIcon /> Your verification link expired. Please sign up again.
  </div>
)}
            <div className="auth-tabs">
              <button
                className={`auth-tab ${tab === "login" ? "active" : ""}`}
                onClick={() => switchTab("login")}
              >
                Log in
              </button>
              <button
                className={`auth-tab ${tab === "signup" ? "active" : ""}`}
                onClick={() => switchTab("signup")}
              >
                Sign up
              </button>
            </div>

            {/* ── LOGIN FORM ──────────────────────────────────── */}
            {tab === "login" && (
              <>
                {loginSuccess ? (
                  <div className="success-box">
                    <div className="success-icon"><CheckCircleIcon /></div>
                 <div className="success-title">Welcome back!</div>
                    <div className="success-sub">Login successful. Redirecting you to your dashboard...</div>
                  </div>
                ) : (
                  <>
                    <div className="auth-heading">Welcome back</div>
                    <div className="auth-subheading">Log in to your FinTrack account</div>

                    {/* Google login */}
                   <button className="btn-google" onClick={async () => {
  const { error } = await signInWithGoogle()
  if (error) console.error(error)
}}>
  <GoogleIcon /> Continue with Google
</button>

                    <div className="auth-divider">
                      <div className="auth-divider-line" />
                      <span className="auth-divider-text">or continue with email</span>
                      <div className="auth-divider-line" />
                    </div>

                    <div className="auth-form">
                      <InputField
                        label="Email address"
                        type="email"
                        placeholder="you@example.com"
                        value={loginEmail}
                        onChange={setLoginEmail}
                        icon={<MailIcon />}
                        error={loginErrors.email}
                      />
                      <InputField
                        label="Password"
                        type={loginShowPw ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginPassword}
                        onChange={setLoginPassword}
                        icon={<LockIcon />}
                        error={loginErrors.password}
                        rightElement={
                          <span onClick={() => setLoginShowPw(!loginShowPw)}>
                            {loginShowPw ? <EyeOffIcon /> : <EyeIcon />}
                          </span>
                        }
                      />

                      <div className="auth-forgot">
                        <button type="button">Forgot password?</button>
                      </div>

                      <button
                        className={`btn-submit ${loginSuccess ? "success" : ""}`}
                        onClick={handleLogin}
                        disabled={loginLoading}
                      >
                        {loginLoading ? (
                          <><div className="spinner" /> Logging in...</>
                        ) : (
                          <>Log in <ArrowRightIcon /></>
                        )}
                      </button>
                    </div>

                    <div className="auth-switch">
                      Don't have an account?{" "}
                      <button onClick={() => switchTab("signup")}>Sign up free</button>
                    </div>
                  </>
                )}
              </>
            )}

            {/* ── SIGNUP FORM ─────────────────────────────────── */}
            {tab === "signup" && (
              <>
             {signupSuccess ? (
  <div className="success-box">
    <div className="success-icon"><CheckCircleIcon /></div>
    <div className="success-title">Check your email!</div>
    <div className="success-sub">
      We sent a verification link to <strong style={{ color: 'var(--white)' }}>{signupEmail}</strong>.
      <br /><br />
      Please verify your email before logging in.
      Check your spam folder if you don't see it.
    </div>
    <button
      className="btn-submit"
      style={{ marginTop: '24px' }}
      onClick={() => switchTab('login')}
    >
      Go to Login
    </button>
  </div>
                ) : (
                  <>
                    <div className="auth-heading">Create account</div>
                    <div className="auth-subheading">Start tracking your finances for free</div>

                    {/* Google signup */}
                  <button className="btn-google" onClick={async () => {
  const { error } = await signInWithGoogle()
  if (error) console.error(error)
}}>
  <GoogleIcon /> Continue with Google
</button>

                    <div className="auth-divider">
                      <div className="auth-divider-line" />
                      <span className="auth-divider-text">or sign up with email</span>
                      <div className="auth-divider-line" />
                    </div>

                    <div className="auth-form">
                      <InputField
                        label="Full name"
                        type="text"
                        placeholder="John Doe"
                        value={signupName}
                        onChange={setSignupName}
                        icon={<UserIcon />}
                        error={signupErrors.name}
                      />
                      <InputField
                        label="Email address"
                        type="email"
                        placeholder="you@example.com"
                        value={signupEmail}
                        onChange={setSignupEmail}
                        icon={<MailIcon />}
                        error={signupErrors.email}
                      />
                      <div>
                        <InputField
                          label="Password"
                          type={signupShowPw ? "text" : "password"}
                          placeholder="Min. 8 characters"
                          value={signupPassword}
                          onChange={setSignupPassword}
                          icon={<LockIcon />}
                          error={signupErrors.password}
                          rightElement={
                            <span onClick={() => setSignupShowPw(!signupShowPw)}>
                              {signupShowPw ? <EyeOffIcon /> : <EyeIcon />}
                            </span>
                          }
                        />
                        <PasswordStrength password={signupPassword} />
                      </div>
                      <InputField
                        label="Confirm password"
                        type={signupShowConfirm ? "text" : "password"}
                        placeholder="Repeat your password"
                        value={signupConfirm}
                        onChange={setSignupConfirm}
                        icon={<LockIcon />}
                        error={signupErrors.confirm}
                        rightElement={
                          <span onClick={() => setSignupShowConfirm(!signupShowConfirm)}>
                            {signupShowConfirm ? <EyeOffIcon /> : <EyeIcon />}
                          </span>
                        }
                      />

                      {/* Terms */}
                      <div>
                        <div className="terms-wrap">
                          <input
                            type="checkbox"
                            className="terms-checkbox"
                            checked={agreedToTerms}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                          />
                          <span>
                            I agree to the{" "}
                            <a href="#" className="terms-link">Terms of Service</a>
                            {" "}and{" "}
                            <a href="#" className="terms-link">Privacy Policy</a>
                          </span>
                        </div>
                        {signupErrors.terms && (
                          <div className="field-error-msg" style={{ marginTop: 6 }}>
                            <AlertIcon /> {signupErrors.terms}
                          </div>
                        )}
                      </div>

                      <button
                        className={`btn-submit ${signupSuccess ? "success" : ""}`}
                        onClick={handleSignup}
                        disabled={signupLoading}
                      >
                        {signupLoading ? (
                          <><div className="spinner" /> Creating account...</>
                        ) : (
                          <>Create account <ArrowRightIcon /></>
                        )}
                      </button>
                    </div>

                    <div className="auth-switch">
                      Already have an account?{" "}
                      <button onClick={() => switchTab("login")}>Log in</button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
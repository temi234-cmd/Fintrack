import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import AuthCallbackPage from './pages/AuthCallbackPage'
import DashboardPage from './pages/DashboardPage'
import TransactionsPage from './pages/TransactionsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import BudgetsPage from './pages/BudgetsPage'
import SettingsPage from './pages/SettingsPage'

function HashRedirectHandler() {
  const navigate = useNavigate()
  useEffect(() => {
    const hash = window.location.hash
    if (hash && hash.includes('access_token')) {
      navigate('/auth/callback' + window.location.search + hash)
    } else if (hash && hash.includes('error=access_denied')) {
      navigate('/auth?error=link_expired')
    }
  }, [navigate])
  return null
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{
      minHeight: '100vh', background: '#080E1A',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#10B981', fontFamily: 'Syne, sans-serif', fontSize: '1.2rem'
    }}>
      Loading...
    </div>
  )
  if (!user) return <Navigate to="/auth" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <HashRedirectHandler />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/transactions" element={
  <ProtectedRoute>
    <TransactionsPage />
  </ProtectedRoute>
} />
<Route path="/analytics" element={
  <ProtectedRoute>
    <AnalyticsPage/>
  </ProtectedRoute>
} />
<Route path="/budgets" element={
  <ProtectedRoute>
    <BudgetsPage />
  </ProtectedRoute>
} />
<Route path="/settings" element={
  <ProtectedRoute>
    <SettingsPage />
  </ProtectedRoute>
} />
      </Routes>
    </BrowserRouter>
  )
}
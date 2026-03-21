import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Google login or email verification
        navigate('/dashboard')
      } else if (event === 'USER_UPDATED') {
        navigate('/auth?verified=true')
      } else {
        const hash = window.location.hash
        if (hash.includes('error=access_denied')) {
          navigate('/auth?error=link_expired')
        }
      }
    })
  }, [navigate])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080E1A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '16px',
      color: '#10B981',
      fontFamily: 'Syne, sans-serif',
    }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: '50%',
        border: '3px solid rgba(16,185,129,0.3)',
        borderTopColor: '#10B981',
        animation: 'spin 0.8s linear infinite'
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p>Setting up your account...</p>
    </div>
  )
}

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

// ── SUPPORTED CURRENCIES ──────────────────────────────────────────────────
export const CURRENCIES = [
  { code: 'USD', symbol: '$',  name: 'US Dollar' },
  { code: 'NGN', symbol: '₦',  name: 'Nigerian Naira' },
  { code: 'EUR', symbol: '€',  name: 'Euro' },
  { code: 'GBP', symbol: '£',  name: 'British Pound' },
  { code: 'GHS', symbol: '₵',  name: 'Ghanaian Cedi' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
  { code: 'ZAR', symbol: 'R',  name: 'South African Rand' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'INR', symbol: '₹',  name: 'Indian Rupee' },
]

interface CurrencyContextType {
  currency: string
  symbol: string
  setCurrency: (code: string) => Promise<void>
  formatAmount: (amount: number) => string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [currency, setCurrencyState] = useState('USD')

  // Load user's currency from profile
  useEffect(() => {
    if (!user) return
    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('currency')
        .eq('id', user.id)
        .single()
      if (data?.currency) setCurrencyState(data.currency)
    }
    fetchProfile()
  }, [user])

  // Get symbol for current currency
  const symbol = CURRENCIES.find(c => c.code === currency)?.symbol || '$'

  // Save currency to Supabase
  const setCurrency = async (code: string) => {
    setCurrencyState(code)
    if (!user) return
    await supabase
      .from('profiles')
      .upsert({ id: user.id, currency: code })
  }

  // Format any amount with user's currency
  const formatAmount = (amount: number) => {
    return `${symbol}${Math.abs(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`
  }

  return (
    <CurrencyContext.Provider value={{ currency, symbol, setCurrency, formatAmount }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) throw new Error('useCurrency must be used inside CurrencyProvider')
  return context
}
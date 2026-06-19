import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'
import { formatDateInput } from '../utils/formatters'

const AppContext = createContext(null)

export const AppProvider = ({ children }) => {
  const { user } = useAuth()

  // Data state
  const [transactions, setTransactions] = useState([])
  const [goals, setGoals] = useState([])
  const [assets, setAssets] = useState([])
  const [investments, setInvestments] = useState([])

  // UI state
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activePage, setActivePage] = useState('dashboard')
  const [toast, setToast] = useState(null)

  // Music state
  const [musicPlaying, setMusicPlaying] = useState(false)
  const [musicVolume, setMusicVolume] = useState(() => {
    return Number(localStorage.getItem('wealthos_volume') ?? 0.5)
  })

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() })
    setTimeout(() => setToast(null), 3500)
  }, [])

  // Fetch all data
  const fetchAll = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const [txRes, goalRes, assetRes, invRes] = await Promise.all([
        supabase.from('transactions').select('*').eq('user_id', user.id).order('date', { ascending: false }),
        supabase.from('goals').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('assets').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('investments').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      ])
      if (!txRes.error) setTransactions(txRes.data || [])
      if (!goalRes.error) setGoals(goalRes.data || [])
      if (!assetRes.error) setAssets(assetRes.data || [])
      if (!invRes.error) setInvestments(invRes.data || [])
    } catch (err) {
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) fetchAll()
    else {
      setTransactions([])
      setGoals([])
      setAssets([])
      setInvestments([])
    }
  }, [user, fetchAll])

  // Save volume preference
  useEffect(() => {
    localStorage.setItem('wealthos_volume', String(musicVolume))
  }, [musicVolume])

  // ===== TRANSACTION CRUD =====
  const addTransaction = async (data) => {
    const { error, data: created } = await supabase.from('transactions').insert({
      ...data,
      user_id: user.id,
      date: data.date || formatDateInput(),
    }).select().single()
    if (error) { showToast(error.message, 'error'); return false }
    setTransactions(prev => [created, ...prev])
    showToast('Transaksi berhasil ditambahkan! 🎉')
    return true
  }

  const updateTransaction = async (id, data) => {
    const { error, data: updated } = await supabase.from('transactions')
      .update(data).eq('id', id).eq('user_id', user.id).select().single()
    if (error) { showToast(error.message, 'error'); return false }
    setTransactions(prev => prev.map(t => t.id === id ? updated : t))
    showToast('Transaksi berhasil diupdate! ✅')
    return true
  }

  const deleteTransaction = async (id) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id).eq('user_id', user.id)
    if (error) { showToast(error.message, 'error'); return false }
    setTransactions(prev => prev.filter(t => t.id !== id))
    showToast('Transaksi dihapus')
    return true
  }

  // ===== GOAL CRUD =====
  const addGoal = async (data) => {
    const { error, data: created } = await supabase.from('goals').insert({
      ...data, user_id: user.id,
    }).select().single()
    if (error) { showToast(error.message, 'error'); return false }
    setGoals(prev => [created, ...prev])
    showToast('Target kekayaan ditambahkan! 🎯')
    return true
  }

  const updateGoal = async (id, data) => {
    const { error, data: updated } = await supabase.from('goals')
      .update(data).eq('id', id).eq('user_id', user.id).select().single()
    if (error) { showToast(error.message, 'error'); return false }
    setGoals(prev => prev.map(g => g.id === id ? updated : g))
    showToast('Target diupdate! ✅')
    return true
  }

  const deleteGoal = async (id) => {
    const { error } = await supabase.from('goals').delete().eq('id', id).eq('user_id', user.id)
    if (error) { showToast(error.message, 'error'); return false }
    setGoals(prev => prev.filter(g => g.id !== id))
    showToast('Target dihapus')
    return true
  }

  // ===== ASSET CRUD =====
  const addAsset = async (data) => {
    const { error, data: created } = await supabase.from('assets').insert({
      ...data, user_id: user.id,
    }).select().single()
    if (error) { showToast(error.message, 'error'); return false }
    setAssets(prev => [created, ...prev])
    showToast('Aset ditambahkan! 💎')
    return true
  }

  const updateAsset = async (id, data) => {
    const { error, data: updated } = await supabase.from('assets')
      .update(data).eq('id', id).eq('user_id', user.id).select().single()
    if (error) { showToast(error.message, 'error'); return false }
    setAssets(prev => prev.map(a => a.id === id ? updated : a))
    showToast('Aset diupdate! ✅')
    return true
  }

  const deleteAsset = async (id) => {
    const { error } = await supabase.from('assets').delete().eq('id', id).eq('user_id', user.id)
    if (error) { showToast(error.message, 'error'); return false }
    setAssets(prev => prev.filter(a => a.id !== id))
    showToast('Aset dihapus')
    return true
  }

  // ===== INVESTMENT CRUD =====
  const addInvestment = async (data) => {
    const { error, data: created } = await supabase.from('investments').insert({
      ...data, user_id: user.id,
    }).select().single()
    if (error) { showToast(error.message, 'error'); return false }
    setInvestments(prev => [created, ...prev])
    showToast('Investasi dicatat! 📈')
    return true
  }

  const updateInvestment = async (id, data) => {
    const { error, data: updated } = await supabase.from('investments')
      .update(data).eq('id', id).eq('user_id', user.id).select().single()
    if (error) { showToast(error.message, 'error'); return false }
    setInvestments(prev => prev.map(i => i.id === id ? updated : i))
    showToast('Investasi diupdate! ✅')
    return true
  }

  const deleteInvestment = async (id) => {
    const { error } = await supabase.from('investments').delete().eq('id', id).eq('user_id', user.id)
    if (error) { showToast(error.message, 'error'); return false }
    setInvestments(prev => prev.filter(i => i.id !== id))
    showToast('Investasi dihapus')
    return true
  }

  // ===== COMPUTED VALUES =====
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const thisMonthTx = transactions.filter(t => {
    const d = new Date(t.date)
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
  })

  const totalIncome = thisMonthTx
    .filter(t => t.type === 'income')
    .reduce((s, t) => s + Number(t.amount), 0)

  const totalExpense = thisMonthTx
    .filter(t => t.type === 'expense')
    .reduce((s, t) => s + Number(t.amount), 0)

  const totalAssets = assets.reduce((s, a) => s + Number(a.current_value || a.value || 0), 0)

  const totalInvestments = investments.reduce((s, i) => s + Number(i.current_value || 0), 0)

  const netWorth = totalAssets + totalInvestments

  const monthlyNet = totalIncome - totalExpense

  // Last month comparison
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

  const lastMonthTx = transactions.filter(t => {
    const d = new Date(t.date)
    return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear
  })

  const lastMonthNet = lastMonthTx.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
    - lastMonthTx.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)

  const netWorthChange = lastMonthNet > 0
    ? ((monthlyNet - lastMonthNet) / lastMonthNet) * 100
    : 0

  return (
    <AppContext.Provider value={{
      // Data
      transactions, goals, assets, investments,
      // Computed
      totalIncome, totalExpense, totalAssets, totalInvestments,
      netWorth, monthlyNet, netWorthChange,
      thisMonthTx, lastMonthTx,
      // Loading
      loading,
      // UI
      sidebarOpen, setSidebarOpen,
      activePage, setActivePage,
      toast,
      showToast,
      // Music
      musicPlaying, setMusicPlaying,
      musicVolume, setMusicVolume,
      // CRUD
      addTransaction, updateTransaction, deleteTransaction,
      addGoal, updateGoal, deleteGoal,
      addAsset, updateAsset, deleteAsset,
      addInvestment, updateInvestment, deleteInvestment,
      fetchAll,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}

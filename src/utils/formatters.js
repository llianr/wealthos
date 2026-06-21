// Format as Indonesian Rupiah
export const formatIDR = (amount, compact = false) => {
  if (amount === null || amount === undefined || isNaN(amount)) return 'Rp 0'
  
  const num = Number(amount)
  
  if (compact) {
    if (Math.abs(num) >= 1_000_000_000) {
      return `Rp ${(num / 1_000_000_000).toFixed(1)}M`
    }
    if (Math.abs(num) >= 1_000_000) {
      return `Rp ${(num / 1_000_000).toFixed(1)}jt`
    }
    if (Math.abs(num) >= 1_000) {
      return `Rp ${(num / 1_000).toFixed(0)}rb`
    }
  }
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

// Format percentage
export const formatPercent = (value, decimals = 1) => {
  if (isNaN(value)) return '0%'
  return `${value >= 0 ? '+' : ''}${Number(value).toFixed(decimals)}%`
}

// Format date
export const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export const formatDateShort = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
  }).format(date)
}

export const formatDateInput = (date = new Date()) => {
  return date.toISOString().split('T')[0]
}

// Calculate percentage change
export const calcPercentChange = (current, previous) => {
  if (!previous || previous === 0) return 0
  return ((current - previous) / Math.abs(previous)) * 100
}

// Capitalize
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Get current month name
export const getCurrentMonthName = () => {
  return new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(new Date())
}

// Get month and year
export const getMonthYear = (dateStr) => {
  const date = dateStr ? new Date(dateStr) : new Date()
  return new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(date)
}

// Days since date
export const daysSince = (dateStr) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now - date
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

// Estimate months to reach target
export const estimateMonthsToTarget = (currentAmount, targetAmount, monthlyNet) => {
  if (monthlyNet <= 0) return null
  const remaining = targetAmount - currentAmount
  if (remaining <= 0) return 0
  return Math.ceil(remaining / monthlyNet)
}

// Color for amount
export const getAmountColor = (amount, isExpense = false) => {
  if (isExpense) return 'text-brand-red'
  return amount >= 0 ? 'text-brand-teal' : 'text-brand-red'
}

// Category icons mapping (returns emoji)
export const INCOME_CATEGORIES = [
  { value: 'gaji', label: 'Gaji', emoji: '💰' },
  { value: 'freelance', label: 'Freelance', emoji: '💻' },
  { value: 'bisnis', label: 'Bisnis', emoji: '🏢' },
  { value: 'airdrop', label: 'Airdrop', emoji: '🪂' },
  { value: 'investasi', label: 'Investasi', emoji: '📈' },
  { value: 'lainnya', label: 'Lainnya', emoji: '✨' },
]

export const EXPENSE_CATEGORIES = [
  { value: 'makan', label: 'Makan', emoji: '🍜' },
  { value: 'transportasi', label: 'Transportasi', emoji: '🚗' },
  { value: 'belanja', label: 'Belanja', emoji: '🛍️' },
  { value: 'hiburan', label: 'Hiburan', emoji: '🎮' },
  { value: 'tagihan', label: 'Tagihan', emoji: '📱' },
  { value: 'kesehatan', label: 'Kesehatan', emoji: '🏥' },
  { value: 'lainnya', label: 'Lainnya', emoji: '📦' },
]

export const ASSET_TYPES = [
  { value: 'tabungan', label: 'Tabungan', emoji: '🏦' },
  { value: 'cash', label: 'Cash', emoji: '💵' },
  { value: 'kripto', label: 'Kripto', emoji: '₿' },
  { value: 'saham', label: 'Saham', emoji: '📊' },
  { value: 'properti', label: 'Properti', emoji: '🏠' },
  { value: 'kendaraan', label: 'Kendaraan', emoji: '🚙' },
  { value: 'lainnya', label: 'Lainnya', emoji: '💎' },
]

export const getCategoryInfo = (value, type = 'income') => {
  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
  return categories.find(c => c.value === value) || { label: capitalize(value), emoji: '📌' }
}

// Resolve the label to actually display for a transaction.
// If the user picked "Lainnya" and typed a custom name, that name wins —
// otherwise falls back to the standard category label.
export const getDisplayLabel = (tx) => {
  if (tx?.custom_category && tx.custom_category.trim()) return tx.custom_category.trim()
  return getCategoryInfo(tx?.category, tx?.type).label
}

// Same idea but returns the emoji too (custom categories keep the "Lainnya" emoji)
export const getDisplayCategory = (tx) => {
  const info = getCategoryInfo(tx?.category, tx?.type)
  const hasCustom = tx?.custom_category && tx.custom_category.trim()
  return {
    emoji: info.emoji,
    label: hasCustom ? tx.custom_category.trim() : info.label,
  }
}

export const getAssetInfo = (value) => {
  return ASSET_TYPES.find(a => a.value === value) || { label: capitalize(value), emoji: '💎' }
}

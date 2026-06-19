import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo } from 'react'
import { Plus, Search, Filter, Trash2, Edit3, ChevronDown, X, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'
import {
  formatIDR, formatDate, formatDateInput,
  INCOME_CATEGORIES, EXPENSE_CATEGORIES, getCategoryInfo
} from '../../utils/formatters'

const TransactionForm = ({ onClose, editData = null }) => {
  const { addTransaction, updateTransaction } = useApp()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    type: editData?.type || 'income',
    category: editData?.category || '',
    amount: editData?.amount ? String(editData.amount) : '',
    description: editData?.description || '',
    date: editData?.date || formatDateInput(),
  })

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.amount || !form.category) return
    setLoading(true)
    const data = { ...form, amount: Number(form.amount) }
    let ok
    if (editData) ok = await updateTransaction(editData.id, data)
    else ok = await addTransaction(data)
    setLoading(false)
    if (ok) onClose()
  }

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div
        className="modal-content p-6 w-full"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-xl font-bold text-white">
            {editData ? '✏️ Edit Transaksi' : '➕ Tambah Transaksi'}
          </h3>
          <button className="btn-glass p-2 rounded-xl" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
            {['income', 'expense'].map(t => (
              <button
                key={t}
                type="button"
                className="py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
                style={{
                  background: form.type === t
                    ? t === 'income' ? 'rgba(0,212,180,0.2)' : 'rgba(255,77,109,0.2)'
                    : 'transparent',
                  color: form.type === t
                    ? t === 'income' ? '#00D4B4' : '#FF4D6D'
                    : '#8B92A5',
                  border: form.type === t
                    ? `1px solid ${t === 'income' ? 'rgba(0,212,180,0.3)' : 'rgba(255,77,109,0.3)'}`
                    : '1px solid transparent',
                }}
                onClick={() => { update('type', t); update('category', '') }}
              >
                {t === 'income' ? '↑ Pemasukan' : '↓ Pengeluaran'}
              </button>
            ))}
          </div>

          {/* Amount */}
          <div>
            <label className="text-text-secondary text-xs font-medium mb-1.5 block">Jumlah (Rp)</label>
            <input
              type="number"
              className="input-premium py-3 px-4 text-lg font-mono font-semibold"
              placeholder="0"
              value={form.amount}
              onChange={e => update('amount', e.target.value)}
              required
              min="1"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-text-secondary text-xs font-medium mb-1.5 block">Kategori</label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  className="p-2 rounded-xl text-xs font-medium transition-all duration-200 flex flex-col items-center gap-1"
                  style={{
                    background: form.category === cat.value
                      ? 'rgba(108,99,255,0.2)'
                      : 'rgba(255,255,255,0.04)',
                    border: form.category === cat.value
                      ? '1px solid rgba(108,99,255,0.4)'
                      : '1px solid rgba(255,255,255,0.06)',
                    color: form.category === cat.value ? '#6C63FF' : '#8B92A5',
                  }}
                  onClick={() => update('category', cat.value)}
                >
                  <span className="text-lg">{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-text-secondary text-xs font-medium mb-1.5 block">Keterangan (opsional)</label>
            <input
              type="text"
              className="input-premium py-3 px-4 text-sm"
              placeholder="Catatan transaksi..."
              value={form.description}
              onChange={e => update('description', e.target.value)}
            />
          </div>

          {/* Date */}
          <div>
            <label className="text-text-secondary text-xs font-medium mb-1.5 block">Tanggal</label>
            <input
              type="date"
              className="input-premium py-3 px-4 text-sm"
              value={form.date}
              onChange={e => update('date', e.target.value)}
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button type="button" className="btn-glass flex-1 py-3 text-sm" onClick={onClose}>
              Batal
            </button>
            <motion.button
              type="submit"
              className="btn-primary flex-[2] py-3 text-sm flex items-center justify-center gap-2"
              disabled={loading || !form.amount || !form.category}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {editData ? 'Update Transaksi' : 'Simpan Transaksi'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

const TransactionPage = () => {
  const { transactions, deleteTransaction, totalIncome, totalExpense } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [editData, setEditData] = useState(null)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterMonth, setFilterMonth] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null)

  const allCategories = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const matchType = filterType === 'all' || t.type === filterType
      const matchCat = !filterCategory || t.category === filterCategory
      const matchSearch = !search || (
        t.description?.toLowerCase().includes(search.toLowerCase()) ||
        t.category?.toLowerCase().includes(search.toLowerCase()) ||
        String(t.amount).includes(search)
      )
      const matchMonth = !filterMonth || t.date?.startsWith(filterMonth)
      return matchType && matchCat && matchSearch && matchMonth
    })
  }, [transactions, filterType, filterCategory, search, filterMonth])

  const filteredIncome = filtered.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
  const filteredExpense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)

  const handleEdit = (tx) => {
    setEditData(tx)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    await deleteTransaction(id)
    setConfirmDelete(null)
  }

  const resetFilters = () => {
    setSearch('')
    setFilterType('all')
    setFilterCategory('')
    setFilterMonth('')
  }

  const hasFilter = search || filterType !== 'all' || filterCategory || filterMonth

  return (
    <div className="space-y-5 pb-24 lg:pb-8">
      {/* Summary Row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Pemasukan', value: filteredIncome, color: '#00D4B4' },
          { label: 'Total Pengeluaran', value: filteredExpense, color: '#FF4D6D' },
          { label: 'Saldo Bersih', value: filteredIncome - filteredExpense, color: filteredIncome - filteredExpense >= 0 ? '#6C63FF' : '#FF4D6D' },
        ].map((item, i) => (
          <motion.div
            key={i}
            className="glass-card p-4 rounded-2xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <p className="text-text-secondary text-xs mb-1">{item.label}</p>
            <p className="font-mono font-bold text-base" style={{ color: item.color }}>
              {item.value >= 0 ? '' : '-'}{formatIDR(Math.abs(item.value), true)}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Search & Filters */}
      <motion.div
        className="glass-card p-4 rounded-2xl space-y-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            className="input-premium pl-10 pr-4 py-2.5 text-sm"
            placeholder="Cari transaksi..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap gap-2">
          {/* Type filter */}
          <div className="flex gap-1 p-0.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
            {[['all', 'Semua'], ['income', 'Pemasukan'], ['expense', 'Pengeluaran']].map(([val, label]) => (
              <button
                key={val}
                className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                style={{
                  background: filterType === val ? 'rgba(108,99,255,0.3)' : 'transparent',
                  color: filterType === val ? '#8B84FF' : '#8B92A5',
                }}
                onClick={() => setFilterType(val)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <select
            className="input-premium px-3 py-1.5 text-xs"
            style={{ width: 'auto' }}
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
          >
            <option value="">Semua Kategori</option>
            {allCategories.map(c => (
              <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
            ))}
          </select>

          {/* Month filter */}
          <input
            type="month"
            className="input-premium px-3 py-1.5 text-xs"
            style={{ width: 'auto' }}
            value={filterMonth}
            onChange={e => setFilterMonth(e.target.value)}
          />

          {hasFilter && (
            <button
              className="px-3 py-1.5 rounded-lg text-xs text-brand-red font-medium flex items-center gap-1"
              style={{ background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.2)' }}
              onClick={resetFilters}
            >
              <X size={12} /> Reset
            </button>
          )}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-text-muted text-xs">{filtered.length} transaksi</p>
          <motion.button
            className="btn-primary px-4 py-2 text-sm flex items-center gap-2"
            onClick={() => { setEditData(null); setShowForm(true) }}
            whileTap={{ scale: 0.97 }}
          >
            <Plus size={16} /> Tambah
          </motion.button>
        </div>
      </motion.div>

      {/* Transaction List */}
      <div className="space-y-2">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <motion.div
              className="glass-card p-10 rounded-2xl text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-white font-medium mb-1">Tidak ada transaksi</p>
              <p className="text-text-secondary text-sm">Coba ubah filter atau tambah transaksi baru</p>
            </motion.div>
          ) : (
            filtered.map((tx, i) => {
              const catInfo = getCategoryInfo(tx.category, tx.type)
              return (
                <motion.div
                  key={tx.id}
                  className="glass-card p-4 rounded-xl"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: i * 0.03 }}
                  layout
                >
                  <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                      style={{
                        background: tx.type === 'income' ? 'rgba(0,212,180,0.12)' : 'rgba(255,77,109,0.12)',
                      }}
                    >
                      {catInfo.emoji}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-white text-sm font-medium truncate">
                          {tx.description || catInfo.label}
                        </p>
                        <span className={`badge ${tx.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                          {catInfo.label}
                        </span>
                      </div>
                      <p className="text-text-muted text-xs mt-0.5">{formatDate(tx.date)}</p>
                    </div>

                    {/* Amount */}
                    <div className="text-right flex-shrink-0">
                      <p
                        className="font-mono font-bold text-base"
                        style={{ color: tx.type === 'income' ? '#00D4B4' : '#FF4D6D' }}
                      >
                        {tx.type === 'income' ? '+' : '-'}{formatIDR(tx.amount, true)}
                      </p>
                      <p className="text-text-muted text-[10px]">{formatIDR(tx.amount)}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        className="p-2 rounded-lg text-text-muted hover:text-white transition-colors"
                        style={{ background: 'rgba(255,255,255,0.04)' }}
                        onClick={() => handleEdit(tx)}
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        className="p-2 rounded-lg text-text-muted hover:text-brand-red transition-colors"
                        style={{ background: 'rgba(255,255,255,0.04)' }}
                        onClick={() => setConfirmDelete(tx.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </div>

      {/* Transaction Form Modal */}
      <AnimatePresence>
        {showForm && (
          <TransactionForm
            onClose={() => { setShowForm(false); setEditData(null) }}
            editData={editData}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {confirmDelete && (
          <div className="modal-backdrop">
            <motion.div
              className="modal-content p-6 max-w-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <p className="text-2xl mb-3 text-center">🗑️</p>
              <h3 className="font-display font-bold text-white text-center mb-2">Hapus Transaksi?</h3>
              <p className="text-text-secondary text-sm text-center mb-5">
                Tindakan ini tidak bisa dibatalkan.
              </p>
              <div className="flex gap-3">
                <button className="btn-glass flex-1 py-2.5 text-sm" onClick={() => setConfirmDelete(null)}>
                  Batal
                </button>
                <button
                  className="flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all"
                  style={{ background: 'rgba(255,77,109,0.2)', color: '#FF4D6D', border: '1px solid rgba(255,77,109,0.3)' }}
                  onClick={() => handleDelete(confirmDelete)}
                >
                  Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TransactionPage

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo } from 'react'
import { Plus, Target, Trash2, Edit3, X, Loader2, Calendar, TrendingUp, Clock } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'
import { formatIDR, formatDateInput, estimateMonthsToTarget } from '../../utils/formatters'

const GoalForm = ({ onClose, editData = null }) => {
  const { addGoal, updateGoal } = useApp()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: editData?.title || '',
    target_amount: editData?.target_amount ? String(editData.target_amount) : '',
    current_amount: editData?.current_amount ? String(editData.current_amount) : '0',
    deadline: editData?.deadline || '',
    description: editData?.description || '',
    emoji: editData?.emoji || '🎯',
  })

  const EMOJIS = ['🎯', '🏠', '🚗', '✈️', '💍', '📱', '💻', '🎓', '💰', '🏖️', '👑', '🚀']

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const pct = form.target_amount > 0
    ? Math.min(100, (Number(form.current_amount) / Number(form.target_amount)) * 100)
    : 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const data = {
      ...form,
      target_amount: Number(form.target_amount),
      current_amount: Number(form.current_amount),
    }
    const ok = editData ? await updateGoal(editData.id, data) : await addGoal(data)
    setLoading(false)
    if (ok) onClose()
  }

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div
        className="modal-content p-6"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-xl font-bold text-white">
            {editData ? '✏️ Edit Target' : '🎯 Buat Target Baru'}
          </h3>
          <button className="btn-glass p-2 rounded-xl" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Emoji picker */}
          <div>
            <label className="text-text-secondary text-xs font-medium mb-2 block">Pilih Ikon</label>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map(em => (
                <button
                  key={em} type="button"
                  className="w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all"
                  style={{
                    background: form.emoji === em ? 'rgba(108,99,255,0.25)' : 'rgba(255,255,255,0.04)',
                    border: form.emoji === em ? '1px solid rgba(108,99,255,0.5)' : '1px solid rgba(255,255,255,0.06)',
                    transform: form.emoji === em ? 'scale(1.15)' : 'scale(1)',
                  }}
                  onClick={() => update('emoji', em)}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-text-secondary text-xs font-medium mb-1.5 block">Nama Target</label>
            <input
              type="text" className="input-premium py-3 px-4 text-sm"
              placeholder="Contoh: Beli Rumah, DP Mobil, Dana Darurat..."
              value={form.title} onChange={e => update('title', e.target.value)} required
            />
          </div>

          {/* Target amount */}
          <div>
            <label className="text-text-secondary text-xs font-medium mb-1.5 block">Target Jumlah (Rp)</label>
            <input
              type="number" className="input-premium py-3 px-4 text-sm font-mono"
              placeholder="0" min="1"
              value={form.target_amount} onChange={e => update('target_amount', e.target.value)} required
            />
          </div>

          {/* Current amount */}
          <div>
            <label className="text-text-secondary text-xs font-medium mb-1.5 block">Sudah Terkumpul (Rp)</label>
            <input
              type="number" className="input-premium py-3 px-4 text-sm font-mono"
              placeholder="0" min="0"
              value={form.current_amount} onChange={e => update('current_amount', e.target.value)}
            />
            {/* Live progress preview */}
            {form.target_amount > 0 && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-text-muted mb-1">
                  <span>Progress</span><span>{pct.toFixed(1)}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* Deadline */}
          <div>
            <label className="text-text-secondary text-xs font-medium mb-1.5 block">Target Tanggal (opsional)</label>
            <input
              type="date" className="input-premium py-3 px-4 text-sm"
              value={form.deadline} onChange={e => update('deadline', e.target.value)}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-text-secondary text-xs font-medium mb-1.5 block">Catatan (opsional)</label>
            <textarea
              className="input-premium py-3 px-4 text-sm resize-none"
              rows={2} placeholder="Motivasi atau catatan target ini..."
              value={form.description} onChange={e => update('description', e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" className="btn-glass flex-1 py-3 text-sm" onClick={onClose}>Batal</button>
            <motion.button
              type="submit"
              className="btn-primary flex-[2] py-3 text-sm flex items-center justify-center gap-2"
              disabled={loading || !form.title || !form.target_amount}
              whileTap={{ scale: 0.98 }}
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {editData ? 'Update Target' : 'Buat Target'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

const GoalCard = ({ goal, onEdit, onDelete }) => {
  const { monthlyNet } = useApp()
  const pct = goal.target_amount > 0
    ? Math.min(100, (goal.current_amount / goal.target_amount) * 100)
    : 0
  const remaining = Math.max(0, goal.target_amount - goal.current_amount)
  const monthsLeft = estimateMonthsToTarget(goal.current_amount, goal.target_amount, monthlyNet)
  const isAchieved = pct >= 100

  const daysUntilDeadline = goal.deadline
    ? Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24))
    : null

  const getBarColor = () => {
    if (isAchieved) return 'linear-gradient(90deg, #00D4B4, #00A890)'
    if (pct >= 75) return 'linear-gradient(90deg, #6C63FF, #00D4B4)'
    if (pct >= 50) return 'linear-gradient(90deg, #F5C518, #6C63FF)'
    return 'linear-gradient(90deg, #FF8C42, #F5C518)'
  }

  return (
    <motion.div
      className="glass-card p-5 rounded-2xl relative overflow-hidden"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ translateY: -2 }}
      transition={{ duration: 0.3 }}
    >
      {/* Achieved badge */}
      {isAchieved && (
        <div className="absolute top-3 right-14 px-2 py-0.5 rounded-full text-xs font-bold"
          style={{ background: 'rgba(0,212,180,0.2)', color: '#00D4B4', border: '1px solid rgba(0,212,180,0.3)' }}>
          ✓ Tercapai!
        </div>
      )}

      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.15)' }}>
            {goal.emoji || '🎯'}
          </div>
          <div>
            <h3 className="font-display font-semibold text-white text-base leading-tight">{goal.title}</h3>
            {goal.description && (
              <p className="text-text-muted text-xs mt-0.5 line-clamp-1">{goal.description}</p>
            )}
          </div>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <button className="p-1.5 rounded-lg text-text-muted hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.04)' }} onClick={onEdit}>
            <Edit3 size={13} />
          </button>
          <button className="p-1.5 rounded-lg text-text-muted hover:text-brand-red transition-colors"
            style={{ background: 'rgba(255,255,255,0.04)' }} onClick={onDelete}>
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Amount info */}
      <div className="flex items-end justify-between mb-3">
        <div>
          <p className="text-text-muted text-xs mb-0.5">Terkumpul</p>
          <p className="font-mono font-bold text-xl text-white">{formatIDR(goal.current_amount, true)}</p>
        </div>
        <div className="text-right">
          <p className="text-text-muted text-xs mb-0.5">Target</p>
          <p className="font-mono font-semibold text-base text-brand-gold">{formatIDR(goal.target_amount, true)}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="progress-bar">
          <motion.div
            className="h-full rounded-full relative overflow-hidden"
            style={{ background: getBarColor() }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
              animation: 'shimmer 2s infinite',
            }} />
          </motion.div>
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-text-muted text-xs">{formatIDR(remaining, true)} lagi</span>
          <span className="text-white text-xs font-semibold font-mono">{pct.toFixed(1)}%</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/5">
        {/* Months estimate */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Clock size={11} className="text-brand-violet" />
            <p className="text-text-muted text-[10px]">Estimasi</p>
          </div>
          <p className="text-white text-xs font-semibold">
            {monthlyNet > 0 && monthsLeft !== null
              ? monthsLeft === 0 ? 'Tercapai!' : `${monthsLeft} bulan`
              : monthlyNet <= 0 ? 'Tambah income' : '—'}
          </p>
        </div>

        {/* Deadline */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Calendar size={11} className="text-brand-gold" />
            <p className="text-text-muted text-[10px]">Deadline</p>
          </div>
          <p className="text-white text-xs font-semibold">
            {goal.deadline
              ? daysUntilDeadline < 0 ? 'Lewat' : `${daysUntilDeadline}h lagi`
              : '—'}
          </p>
        </div>

        {/* Monthly needed */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <TrendingUp size={11} className="text-brand-teal" />
            <p className="text-text-muted text-[10px]">Butuh/bln</p>
          </div>
          <p className="text-white text-xs font-semibold">
            {goal.deadline && daysUntilDeadline > 0
              ? formatIDR(remaining / Math.max(1, Math.ceil(daysUntilDeadline / 30)), true)
              : '—'}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

const GoalsPage = () => {
  const { goals, deleteGoal, monthlyNet, netWorth } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [editData, setEditData] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const totalTargetAmount = goals.reduce((s, g) => s + Number(g.target_amount || 0), 0)
  const totalCurrentAmount = goals.reduce((s, g) => s + Number(g.current_amount || 0), 0)
  const achievedGoals = goals.filter(g => g.current_amount >= g.target_amount).length
  const overallPct = totalTargetAmount > 0 ? Math.min(100, (totalCurrentAmount / totalTargetAmount) * 100) : 0

  return (
    <div className="space-y-5 pb-24 lg:pb-8">
      {/* Overview card */}
      <motion.div
        className="glass-card p-5 rounded-2xl"
        style={{ background: 'linear-gradient(135deg, rgba(245,197,24,0.08), rgba(17,19,24,0.98))' }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div>
            <p className="text-text-secondary text-xs uppercase tracking-widest mb-1">Total Progress Semua Target</p>
            <p className="font-display text-3xl font-bold text-gradient-gold">
              {overallPct.toFixed(1)}%
            </p>
          </div>
          <div className="flex gap-4 text-right flex-wrap">
            <div>
              <p className="text-text-muted text-xs">Terkumpul</p>
              <p className="text-white font-mono font-semibold">{formatIDR(totalCurrentAmount, true)}</p>
            </div>
            <div>
              <p className="text-text-muted text-xs">Total Target</p>
              <p className="text-brand-gold font-mono font-semibold">{formatIDR(totalTargetAmount, true)}</p>
            </div>
            <div>
              <p className="text-text-muted text-xs">Tercapai</p>
              <p className="text-brand-teal font-mono font-semibold">{achievedGoals}/{goals.length}</p>
            </div>
          </div>
        </div>
        <div className="progress-bar" style={{ height: 8 }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #F5C518, #6C63FF, #00D4B4)' }}
            initial={{ width: 0 }}
            animate={{ width: `${overallPct}%` }}
            transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1] }}
          />
        </div>
      </motion.div>

      {/* Monthly simulation */}
      {monthlyNet > 0 && (
        <motion.div
          className="glass-card p-4 rounded-xl flex items-center gap-3"
          style={{ background: 'rgba(108,99,255,0.06)', borderColor: 'rgba(108,99,255,0.15)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(108,99,255,0.15)' }}>
            <TrendingUp size={16} className="text-brand-violet" />
          </div>
          <div className="text-sm">
            <span className="text-white font-medium">Simulasi: </span>
            <span className="text-text-secondary">Dengan rata-rata tabungan </span>
            <span className="text-brand-violet font-semibold font-mono">{formatIDR(monthlyNet, true)}/bln</span>
            <span className="text-text-secondary">, kamu butuh </span>
            <span className="text-brand-gold font-semibold">
              {totalTargetAmount - totalCurrentAmount > 0
                ? `${Math.ceil((totalTargetAmount - totalCurrentAmount) / monthlyNet)} bulan`
                : 'semua target sudah tercapai! 🎉'}
            </span>
            <span className="text-text-secondary"> untuk mencapai semua target.</span>
          </div>
        </motion.div>
      )}

      {/* Add button */}
      <div className="flex justify-between items-center">
        <p className="text-text-secondary text-sm">{goals.length} target aktif</p>
        <motion.button
          className="btn-primary px-4 py-2 text-sm flex items-center gap-2"
          onClick={() => { setEditData(null); setShowForm(true) }}
          whileTap={{ scale: 0.97 }}
        >
          <Plus size={16} /> Buat Target
        </motion.button>
      </div>

      {/* Goals grid */}
      {goals.length === 0 ? (
        <motion.div className="glass-card p-12 rounded-2xl text-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-5xl mb-4">🎯</p>
          <p className="font-display text-lg font-semibold text-white mb-2">Belum ada target kekayaan</p>
          <p className="text-text-secondary text-sm mb-5">Buat target keuangan pertamamu dan mulai perjalanan menuju kebebasan finansial!</p>
          <button className="btn-primary px-6 py-2.5 text-sm"
            onClick={() => { setEditData(null); setShowForm(true) }}>
            Buat Target Pertama
          </button>
        </motion.div>
      ) : (
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          {goals.map((goal, i) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={() => { setEditData(goal); setShowForm(true) }}
              onDelete={() => setConfirmDelete(goal.id)}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <GoalForm onClose={() => { setShowForm(false); setEditData(null) }} editData={editData} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmDelete && (
          <div className="modal-backdrop">
            <motion.div className="modal-content p-6 max-w-sm"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
              <p className="text-2xl text-center mb-3">🗑️</p>
              <h3 className="font-display font-bold text-white text-center mb-2">Hapus Target?</h3>
              <p className="text-text-secondary text-sm text-center mb-5">Progress yang sudah kamu capai akan hilang.</p>
              <div className="flex gap-3">
                <button className="btn-glass flex-1 py-2.5 text-sm" onClick={() => setConfirmDelete(null)}>Batal</button>
                <button className="flex-1 py-2.5 text-sm font-semibold rounded-xl"
                  style={{ background: 'rgba(255,77,109,0.2)', color: '#FF4D6D', border: '1px solid rgba(255,77,109,0.3)' }}
                  onClick={() => { deleteGoal(confirmDelete); setConfirmDelete(null) }}>Hapus</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default GoalsPage

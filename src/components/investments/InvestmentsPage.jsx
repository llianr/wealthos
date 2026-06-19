import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo } from 'react'
import { Plus, Trash2, Edit3, X, Loader2, TrendingUp, TrendingDown, BarChart2 } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import { useApp } from '../../contexts/AppContext'
import { formatIDR, formatDate, formatDateInput } from '../../utils/formatters'

const INV_TYPES = [
  { value: 'saham', label: 'Saham', emoji: '📊' },
  { value: 'kripto', label: 'Kripto', emoji: '₿' },
  { value: 'reksadana', label: 'Reksa Dana', emoji: '📈' },
  { value: 'obligasi', label: 'Obligasi', emoji: '🏦' },
  { value: 'forex', label: 'Forex', emoji: '💱' },
  { value: 'p2p', label: 'P2P Lending', emoji: '🤝' },
  { value: 'lainnya', label: 'Lainnya', emoji: '💎' },
]

const InvestmentForm = ({ onClose, editData = null }) => {
  const { addInvestment, updateInvestment } = useApp()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: editData?.name || '',
    type: editData?.type || 'saham',
    modal: editData?.modal ? String(editData.modal) : '',
    current_value: editData?.current_value ? String(editData.current_value) : '',
    platform: editData?.platform || '',
    ticker: editData?.ticker || '',
    quantity: editData?.quantity ? String(editData.quantity) : '',
    buy_date: editData?.buy_date || formatDateInput(),
    notes: editData?.notes || '',
  })

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const pnl = form.current_value && form.modal
    ? Number(form.current_value) - Number(form.modal) : 0
  const roi = Number(form.modal) > 0 ? (pnl / Number(form.modal)) * 100 : 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const data = {
      ...form,
      modal: Number(form.modal),
      current_value: Number(form.current_value || form.modal),
      quantity: form.quantity ? Number(form.quantity) : null,
    }
    const ok = editData ? await updateInvestment(editData.id, data) : await addInvestment(data)
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
            {editData ? '✏️ Edit Investasi' : '📈 Catat Investasi'}
          </h3>
          <button className="btn-glass p-2 rounded-xl" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type */}
          <div>
            <label className="text-text-secondary text-xs font-medium mb-2 block">Jenis Investasi</label>
            <div className="grid grid-cols-4 gap-2">
              {INV_TYPES.map(t => (
                <button key={t.value} type="button"
                  className="p-2 rounded-xl text-xs flex flex-col items-center gap-1 transition-all"
                  style={{
                    background: form.type === t.value ? 'rgba(108,99,255,0.2)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${form.type === t.value ? 'rgba(108,99,255,0.4)' : 'rgba(255,255,255,0.06)'}`,
                    color: form.type === t.value ? '#8B84FF' : '#8B92A5',
                  }}
                  onClick={() => update('type', t.value)}>
                  <span className="text-xl">{t.emoji}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-text-secondary text-xs font-medium mb-1.5 block">Nama Aset</label>
              <input type="text" className="input-premium py-3 px-4 text-sm"
                placeholder="BBCA, BTC, SCHD..." value={form.name}
                onChange={e => update('name', e.target.value)} required />
            </div>
            <div>
              <label className="text-text-secondary text-xs font-medium mb-1.5 block">Ticker / Symbol</label>
              <input type="text" className="input-premium py-3 px-4 text-sm uppercase"
                placeholder="BBCA, BTC..." value={form.ticker}
                onChange={e => update('ticker', e.target.value.toUpperCase())} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-text-secondary text-xs font-medium mb-1.5 block">Modal (Rp)</label>
              <input type="number" className="input-premium py-3 px-4 text-sm font-mono"
                placeholder="0" min="1" value={form.modal}
                onChange={e => update('modal', e.target.value)} required />
            </div>
            <div>
              <label className="text-text-secondary text-xs font-medium mb-1.5 block">Nilai Saat Ini (Rp)</label>
              <input type="number" className="input-premium py-3 px-4 text-sm font-mono"
                placeholder="= modal jika sama" value={form.current_value}
                onChange={e => update('current_value', e.target.value)} />
            </div>
          </div>

          {/* P&L live preview */}
          {form.modal && form.current_value && (
            <motion.div className="p-3 rounded-xl grid grid-cols-3 gap-3 text-sm"
              style={{
                background: pnl >= 0 ? 'rgba(0,212,180,0.07)' : 'rgba(255,77,109,0.07)',
                border: `1px solid ${pnl >= 0 ? 'rgba(0,212,180,0.2)' : 'rgba(255,77,109,0.2)'}`,
              }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="text-center">
                <p className="text-text-muted text-[10px] mb-0.5">P&L</p>
                <p className="font-mono font-bold text-sm" style={{ color: pnl >= 0 ? '#00D4B4' : '#FF4D6D' }}>
                  {pnl >= 0 ? '+' : ''}{formatIDR(pnl, true)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-text-muted text-[10px] mb-0.5">ROI</p>
                <p className="font-mono font-bold text-sm" style={{ color: roi >= 0 ? '#00D4B4' : '#FF4D6D' }}>
                  {roi >= 0 ? '+' : ''}{roi.toFixed(2)}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-text-muted text-[10px] mb-0.5">Status</p>
                <p className="font-bold text-sm">{pnl >= 0 ? '📈 Profit' : '📉 Loss'}</p>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-text-secondary text-xs font-medium mb-1.5 block">Platform</label>
              <input type="text" className="input-premium py-3 px-4 text-sm"
                placeholder="Stockbit, Binance..." value={form.platform}
                onChange={e => update('platform', e.target.value)} />
            </div>
            <div>
              <label className="text-text-secondary text-xs font-medium mb-1.5 block">Tanggal Beli</label>
              <input type="date" className="input-premium py-3 px-4 text-sm"
                value={form.buy_date} onChange={e => update('buy_date', e.target.value)} />
            </div>
          </div>

          <div>
            <label className="text-text-secondary text-xs font-medium mb-1.5 block">Catatan</label>
            <input type="text" className="input-premium py-3 px-4 text-sm"
              placeholder="Strategi, target harga, dll..." value={form.notes}
              onChange={e => update('notes', e.target.value)} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" className="btn-glass flex-1 py-3 text-sm" onClick={onClose}>Batal</button>
            <motion.button type="submit"
              className="btn-primary flex-[2] py-3 text-sm flex items-center justify-center gap-2"
              disabled={loading || !form.name || !form.modal} whileTap={{ scale: 0.98 }}>
              {loading && <Loader2 size={16} className="animate-spin" />}
              {editData ? 'Update' : 'Catat Investasi'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

const InvestmentsPage = () => {
  const { investments, deleteInvestment, totalInvestments } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [editData, setEditData] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [activeType, setActiveType] = useState('all')

  const filtered = useMemo(() =>
    activeType === 'all' ? investments : investments.filter(i => i.type === activeType),
    [investments, activeType])

  const totalModal = investments.reduce((s, i) => s + Number(i.modal || 0), 0)
  const totalPnL = totalInvestments - totalModal
  const totalROI = totalModal > 0 ? (totalPnL / totalModal) * 100 : 0

  // Chart: performance by asset
  const perfChartData = investments.map(inv => ({
    name: inv.ticker || inv.name?.substring(0, 6) || 'N/A',
    ROI: totalModal > 0 ? ((Number(inv.current_value || inv.modal || 0) - Number(inv.modal || 0)) / Number(inv.modal || 1)) * 100 : 0,
    color: Number(inv.current_value || inv.modal || 0) >= Number(inv.modal || 0) ? '#00D4B4' : '#FF4D6D',
  })).sort((a, b) => b.ROI - a.ROI)

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="custom-tooltip text-sm">
        <p className="text-white font-semibold mb-1">{label}</p>
        <p className="font-mono" style={{ color: payload[0].value >= 0 ? '#00D4B4' : '#FF4D6D' }}>
          ROI: {payload[0].value >= 0 ? '+' : ''}{payload[0].value.toFixed(2)}%
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-5 pb-24 lg:pb-8">
      {/* Portfolio summary */}
      <motion.div className="glass-card p-5 rounded-2xl"
        style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.09), rgba(17,19,24,0.98))' }}
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Portfolio', value: formatIDR(totalInvestments), color: '#6C63FF' },
            { label: 'Total Modal', value: formatIDR(totalModal), color: '#8B92A5' },
            {
              label: 'Total P&L',
              value: `${totalPnL >= 0 ? '+' : ''}${formatIDR(totalPnL, true)}`,
              color: totalPnL >= 0 ? '#00D4B4' : '#FF4D6D'
            },
            {
              label: 'Total ROI',
              value: `${totalROI >= 0 ? '+' : ''}${totalROI.toFixed(2)}%`,
              color: totalROI >= 0 ? '#00D4B4' : '#FF4D6D'
            },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}>
              <p className="text-text-muted text-xs mb-1">{item.label}</p>
              <p className="font-mono font-bold text-lg" style={{ color: item.color }}>{item.value}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Performance chart */}
      {investments.length > 0 && (
        <motion.div className="glass-card p-5 rounded-2xl"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-white">Performa Portfolio (ROI %)</h3>
            <BarChart2 size={16} className="text-text-muted" />
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={perfChartData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#8B92A5', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8B92A5', fontSize: 10 }} axisLine={false} tickLine={false}
                tickFormatter={v => `${v.toFixed(0)}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="ROI" radius={[4, 4, 0, 0]}>
                {perfChartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Filter + Add */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-2 overflow-x-auto">
          {[{ value: 'all', label: 'Semua' }, ...INV_TYPES].map(t => (
            <button key={t.value}
              className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all"
              style={{
                background: activeType === t.value ? 'rgba(108,99,255,0.2)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${activeType === t.value ? 'rgba(108,99,255,0.4)' : 'rgba(255,255,255,0.06)'}`,
                color: activeType === t.value ? '#8B84FF' : '#8B92A5',
              }}
              onClick={() => setActiveType(t.value)}>
              {t.emoji && <span>{t.emoji}</span>}
              {t.label}
            </button>
          ))}
        </div>
        <motion.button className="btn-primary px-4 py-2 text-sm flex items-center gap-2 flex-shrink-0"
          onClick={() => { setEditData(null); setShowForm(true) }} whileTap={{ scale: 0.97 }}>
          <Plus size={16} /> Catat Investasi
        </motion.button>
      </div>

      {/* Investment cards */}
      {filtered.length === 0 ? (
        <motion.div className="glass-card p-12 rounded-2xl text-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-5xl mb-4">📈</p>
          <p className="font-display text-lg font-semibold text-white mb-2">Portfolio masih kosong</p>
          <p className="text-text-secondary text-sm mb-5">Catat investasimu dan pantau performa dari satu tempat.</p>
          <button className="btn-primary px-6 py-2.5 text-sm"
            onClick={() => { setEditData(null); setShowForm(true) }}>Catat Investasi Pertama</button>
        </motion.div>
      ) : (
        <div className="grid gap-3 grid-cols-1 lg:grid-cols-2">
          {filtered.map((inv, i) => {
            const pnl = Number(inv.current_value || inv.modal || 0) - Number(inv.modal || 0)
            const roi = Number(inv.modal) > 0 ? (pnl / Number(inv.modal)) * 100 : 0
            const isProfit = pnl >= 0
            const typeInfo = INV_TYPES.find(t => t.value === inv.type) || INV_TYPES[INV_TYPES.length - 1]

            return (
              <motion.div key={inv.id}
                className="glass-card p-4 rounded-xl relative overflow-hidden"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }} whileHover={{ translateY: -2 }}>
                <div className="absolute top-0 right-0 w-24 h-24 opacity-[0.04] rounded-full"
                  style={{ background: isProfit ? '#00D4B4' : '#FF4D6D', transform: 'translate(30%,-30%)' }} />

                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                      style={{ background: isProfit ? 'rgba(0,212,180,0.1)' : 'rgba(255,77,109,0.1)' }}>
                      {typeInfo.emoji}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{inv.name}</p>
                      <p className="text-text-muted text-xs">
                        {inv.ticker && <span className="text-brand-violet font-mono">{inv.ticker} · </span>}
                        {typeInfo.label}{inv.platform && ` · ${inv.platform}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded-lg text-text-muted hover:text-white"
                      style={{ background: 'rgba(255,255,255,0.04)' }}
                      onClick={() => { setEditData(inv); setShowForm(true) }}>
                      <Edit3 size={12} />
                    </button>
                    <button className="p-1.5 rounded-lg text-text-muted hover:text-brand-red"
                      style={{ background: 'rgba(255,255,255,0.04)' }}
                      onClick={() => setConfirmDelete(inv.id)}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-2 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div>
                    <p className="text-text-muted text-[10px] mb-0.5">Modal</p>
                    <p className="font-mono text-xs font-semibold text-white">{formatIDR(inv.modal, true)}</p>
                  </div>
                  <div>
                    <p className="text-text-muted text-[10px] mb-0.5">Nilai Kini</p>
                    <p className="font-mono text-xs font-semibold text-white">{formatIDR(inv.current_value || inv.modal, true)}</p>
                  </div>
                  <div>
                    <p className="text-text-muted text-[10px] mb-0.5">P&L</p>
                    <p className="font-mono text-xs font-semibold" style={{ color: isProfit ? '#00D4B4' : '#FF4D6D' }}>
                      {pnl >= 0 ? '+' : ''}{formatIDR(pnl, true)}
                    </p>
                  </div>
                  <div>
                    <p className="text-text-muted text-[10px] mb-0.5">ROI</p>
                    <div className="flex items-center gap-0.5">
                      {isProfit ? <TrendingUp size={11} className="text-brand-teal" /> : <TrendingDown size={11} className="text-brand-red" />}
                      <p className="font-mono text-xs font-bold" style={{ color: isProfit ? '#00D4B4' : '#FF4D6D' }}>
                        {roi >= 0 ? '+' : ''}{roi.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>

                {inv.notes && <p className="text-text-muted text-xs mt-2 italic">{inv.notes}</p>}
                {inv.buy_date && <p className="text-text-muted text-[10px] mt-1">Beli: {formatDate(inv.buy_date)}</p>}
              </motion.div>
            )
          })}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <InvestmentForm onClose={() => { setShowForm(false); setEditData(null) }} editData={editData} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmDelete && (
          <div className="modal-backdrop">
            <motion.div className="modal-content p-6 max-w-sm"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
              <p className="text-2xl text-center mb-3">🗑️</p>
              <h3 className="font-display font-bold text-white text-center mb-4">Hapus investasi ini?</h3>
              <div className="flex gap-3">
                <button className="btn-glass flex-1 py-2.5 text-sm" onClick={() => setConfirmDelete(null)}>Batal</button>
                <button className="flex-1 py-2.5 text-sm font-semibold rounded-xl"
                  style={{ background: 'rgba(255,77,109,0.2)', color: '#FF4D6D', border: '1px solid rgba(255,77,109,0.3)' }}
                  onClick={() => { deleteInvestment(confirmDelete); setConfirmDelete(null) }}>Hapus</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default InvestmentsPage

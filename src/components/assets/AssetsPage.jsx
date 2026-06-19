import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo } from 'react'
import { Plus, Trash2, Edit3, X, Loader2, Wallet } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { useApp } from '../../contexts/AppContext'
import { formatIDR, ASSET_TYPES, getAssetInfo } from '../../utils/formatters'

const AssetForm = ({ onClose, editData = null }) => {
  const { addAsset, updateAsset } = useApp()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: editData?.name || '',
    type: editData?.type || 'tabungan',
    value: editData?.value ? String(editData.value) : '',
    current_value: editData?.current_value ? String(editData.current_value) : '',
    notes: editData?.notes || '',
    institution: editData?.institution || '',
  })

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const pnl = form.current_value && form.value
    ? Number(form.current_value) - Number(form.value) : 0
  const pnlPct = form.value > 0 ? (pnl / Number(form.value)) * 100 : 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const data = {
      ...form,
      value: Number(form.value),
      current_value: Number(form.current_value || form.value),
    }
    const ok = editData ? await updateAsset(editData.id, data) : await addAsset(data)
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
            {editData ? '✏️ Edit Aset' : '💎 Tambah Aset'}
          </h3>
          <button className="btn-glass p-2 rounded-xl" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Asset type grid */}
          <div>
            <label className="text-text-secondary text-xs font-medium mb-2 block">Jenis Aset</label>
            <div className="grid grid-cols-4 gap-2">
              {ASSET_TYPES.map(at => (
                <button key={at.value} type="button"
                  className="p-2.5 rounded-xl text-xs font-medium flex flex-col items-center gap-1 transition-all"
                  style={{
                    background: form.type === at.value ? 'rgba(245,197,24,0.15)' : 'rgba(255,255,255,0.04)',
                    border: form.type === at.value ? '1px solid rgba(245,197,24,0.35)' : '1px solid rgba(255,255,255,0.06)',
                    color: form.type === at.value ? '#F5C518' : '#8B92A5',
                  }}
                  onClick={() => update('type', at.value)}>
                  <span className="text-xl">{at.emoji}</span>
                  <span>{at.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-text-secondary text-xs font-medium mb-1.5 block">Nama Aset</label>
            <input type="text" className="input-premium py-3 px-4 text-sm"
              placeholder={`Contoh: ${getAssetInfo(form.type)?.label} BCA, BBCA, Bitcoin...`}
              value={form.name} onChange={e => update('name', e.target.value)} required />
          </div>

          {/* Institution */}
          <div>
            <label className="text-text-secondary text-xs font-medium mb-1.5 block">Institusi / Platform (opsional)</label>
            <input type="text" className="input-premium py-3 px-4 text-sm"
              placeholder="BCA, Bibit, Binance, OLX..."
              value={form.institution} onChange={e => update('institution', e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Initial value */}
            <div>
              <label className="text-text-secondary text-xs font-medium mb-1.5 block">Nilai Awal (Rp)</label>
              <input type="number" className="input-premium py-3 px-4 text-sm font-mono"
                placeholder="0" min="0"
                value={form.value} onChange={e => update('value', e.target.value)} required />
            </div>

            {/* Current value */}
            <div>
              <label className="text-text-secondary text-xs font-medium mb-1.5 block">Nilai Saat Ini (Rp)</label>
              <input type="number" className="input-premium py-3 px-4 text-sm font-mono"
                placeholder="Sama dgn awal"
                value={form.current_value} onChange={e => update('current_value', e.target.value)} />
            </div>
          </div>

          {/* P&L preview */}
          {form.value && form.current_value && (
            <div className="p-3 rounded-xl text-sm"
              style={{
                background: pnl >= 0 ? 'rgba(0,212,180,0.08)' : 'rgba(255,77,109,0.08)',
                border: `1px solid ${pnl >= 0 ? 'rgba(0,212,180,0.2)' : 'rgba(255,77,109,0.2)'}`,
              }}>
              <span className="text-text-secondary">Untung/Rugi: </span>
              <span className="font-mono font-bold" style={{ color: pnl >= 0 ? '#00D4B4' : '#FF4D6D' }}>
                {pnl >= 0 ? '+' : ''}{formatIDR(pnl, true)} ({pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(2)}%)
              </span>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="text-text-secondary text-xs font-medium mb-1.5 block">Catatan (opsional)</label>
            <input type="text" className="input-premium py-3 px-4 text-sm"
              placeholder="Keterangan tambahan..." value={form.notes} onChange={e => update('notes', e.target.value)} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" className="btn-glass flex-1 py-3 text-sm" onClick={onClose}>Batal</button>
            <motion.button type="submit"
              className="btn-primary flex-[2] py-3 text-sm flex items-center justify-center gap-2"
              disabled={loading || !form.name || !form.value} whileTap={{ scale: 0.98 }}>
              {loading && <Loader2 size={16} className="animate-spin" />}
              {editData ? 'Update Aset' : 'Simpan Aset'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

const ASSET_COLORS = {
  tabungan: '#6C63FF', cash: '#F5C518', kripto: '#FF8C42',
  saham: '#00D4B4', properti: '#FF4D6D', kendaraan: '#8B84FF', lainnya: '#8B92A5',
}

const AssetsPage = () => {
  const { assets, deleteAsset, totalAssets } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [editData, setEditData] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [activeType, setActiveType] = useState('all')

  const filtered = useMemo(() =>
    activeType === 'all' ? assets : assets.filter(a => a.type === activeType),
    [assets, activeType])

  const assetsByType = useMemo(() => {
    const grouped = {}
    assets.forEach(a => {
      const key = a.type || 'lainnya'
      if (!grouped[key]) grouped[key] = { total: 0, count: 0 }
      grouped[key].total += Number(a.current_value || a.value || 0)
      grouped[key].count += 1
    })
    return grouped
  }, [assets])

  const pieData = Object.entries(assetsByType)
    .map(([type, data]) => ({
      name: getAssetInfo(type)?.label || type,
      value: data.total,
      color: ASSET_COLORS[type] || '#8B92A5',
      type,
    }))
    .filter(d => d.value > 0)

  const totalPnL = assets.reduce((s, a) =>
    s + (Number(a.current_value || a.value || 0) - Number(a.value || 0)), 0)

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="custom-tooltip text-sm">
        <p className="text-white font-semibold">{payload[0].name}</p>
        <p className="text-text-secondary">{formatIDR(payload[0].value)}</p>
        <p className="text-text-muted text-xs">{((payload[0].value / totalAssets) * 100).toFixed(1)}%</p>
      </div>
    )
  }

  return (
    <div className="space-y-5 pb-24 lg:pb-8">
      {/* Overview */}
      <motion.div className="glass-card p-5 rounded-2xl"
        style={{ background: 'linear-gradient(135deg, rgba(245,197,24,0.07), rgba(17,19,24,0.98))' }}
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-text-secondary text-xs uppercase tracking-widest mb-1">Total Nilai Aset</p>
            <p className="font-display text-3xl font-bold text-gradient-gold">{formatIDR(totalAssets)}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs font-mono font-semibold"
                style={{ color: totalPnL >= 0 ? '#00D4B4' : '#FF4D6D' }}>
                {totalPnL >= 0 ? '+' : ''}{formatIDR(totalPnL, true)} P&L
              </span>
              <span className="text-text-muted text-xs">dari harga beli</span>
            </div>
          </div>
          {pieData.length > 0 && (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={100} height={100}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={28} outerRadius={45}
                    dataKey="value" paddingAngle={3}>
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1">
                {pieData.map((d, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs">
                    <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                    <span className="text-text-secondary">{d.name}</span>
                    <span className="text-white font-mono ml-1">{((d.value / totalAssets) * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {[{ value: 'all', label: 'Semua', emoji: '💎' }, ...ASSET_TYPES].map(t => (
          <button key={t.value}
            className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all"
            style={{
              background: activeType === t.value ? ASSET_COLORS[t.value] ? `${ASSET_COLORS[t.value]}20` : 'rgba(108,99,255,0.2)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${activeType === t.value ? (ASSET_COLORS[t.value] || '#6C63FF') + '40' : 'rgba(255,255,255,0.06)'}`,
              color: activeType === t.value ? ASSET_COLORS[t.value] || '#6C63FF' : '#8B92A5',
            }}
            onClick={() => setActiveType(t.value)}>
            <span>{t.emoji}</span>
            <span>{t.label}</span>
            {assetsByType[t.value] && <span className="ml-0.5 opacity-60">({assetsByType[t.value].count})</span>}
          </button>
        ))}
      </div>

      {/* Add + count row */}
      <div className="flex justify-between items-center">
        <p className="text-text-secondary text-sm">{filtered.length} aset</p>
        <motion.button className="btn-primary px-4 py-2 text-sm flex items-center gap-2"
          onClick={() => { setEditData(null); setShowForm(true) }} whileTap={{ scale: 0.97 }}>
          <Plus size={16} /> Tambah Aset
        </motion.button>
      </div>

      {/* Asset cards */}
      {filtered.length === 0 ? (
        <motion.div className="glass-card p-12 rounded-2xl text-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-5xl mb-4">💼</p>
          <p className="font-display text-lg font-semibold text-white mb-2">
            {activeType === 'all' ? 'Belum ada aset dicatat' : `Belum ada aset ${getAssetInfo(activeType)?.label}`}
          </p>
          <p className="text-text-secondary text-sm mb-5">Catat semua asetmu untuk memantau total kekayaan!</p>
          <button className="btn-primary px-6 py-2.5 text-sm"
            onClick={() => { setEditData(null); setShowForm(true) }}>Tambah Aset</button>
        </motion.div>
      ) : (
        <div className="grid gap-3 grid-cols-1 lg:grid-cols-2">
          {filtered.map((asset, i) => {
            const info = getAssetInfo(asset.type)
            const pnl = Number(asset.current_value || asset.value || 0) - Number(asset.value || 0)
            const pnlPct = Number(asset.value) > 0 ? (pnl / Number(asset.value)) * 100 : 0
            const color = ASSET_COLORS[asset.type] || '#8B92A5'

            return (
              <motion.div key={asset.id}
                className="glass-card p-4 rounded-xl relative overflow-hidden"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ translateY: -2 }}>
                <div className="absolute inset-0 opacity-[0.04] rounded-xl"
                  style={{ background: `radial-gradient(circle at top right, ${color}, transparent 60%)` }} />

                <div className="relative z-10 flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                    {info?.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-white font-semibold text-sm">{asset.name}</p>
                        <p className="text-text-muted text-xs">
                          {info?.label}{asset.institution ? ` · ${asset.institution}` : ''}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button className="p-1.5 rounded-lg text-text-muted hover:text-white"
                          style={{ background: 'rgba(255,255,255,0.04)' }}
                          onClick={() => { setEditData(asset); setShowForm(true) }}>
                          <Edit3 size={12} />
                        </button>
                        <button className="p-1.5 rounded-lg text-text-muted hover:text-brand-red"
                          style={{ background: 'rgba(255,255,255,0.04)' }}
                          onClick={() => setConfirmDelete(asset.id)}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                      <div>
                        <p className="text-text-muted text-[10px]">Nilai Saat Ini</p>
                        <p className="font-mono font-bold text-base" style={{ color }}>
                          {formatIDR(asset.current_value || asset.value, true)}
                        </p>
                      </div>
                      {pnl !== 0 && (
                        <div className="text-right">
                          <p className="text-text-muted text-[10px]">P&L</p>
                          <p className="font-mono text-sm font-semibold"
                            style={{ color: pnl >= 0 ? '#00D4B4' : '#FF4D6D' }}>
                            {pnl >= 0 ? '+' : ''}{formatIDR(pnl, true)} ({pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(1)}%)
                          </p>
                        </div>
                      )}
                      <div className="text-right">
                        <p className="text-text-muted text-[10px]">Porsi</p>
                        <p className="font-mono text-sm font-semibold text-white">
                          {totalAssets > 0 ? ((Number(asset.current_value || asset.value || 0) / totalAssets) * 100).toFixed(1) : 0}%
                        </p>
                      </div>
                    </div>
                    {asset.notes && <p className="text-text-muted text-xs mt-1.5 italic">{asset.notes}</p>}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <AssetForm onClose={() => { setShowForm(false); setEditData(null) }} editData={editData} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmDelete && (
          <div className="modal-backdrop">
            <motion.div className="modal-content p-6 max-w-sm"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
              <p className="text-2xl text-center mb-3">🗑️</p>
              <h3 className="font-display font-bold text-white text-center mb-4">Hapus aset ini?</h3>
              <div className="flex gap-3">
                <button className="btn-glass flex-1 py-2.5 text-sm" onClick={() => setConfirmDelete(null)}>Batal</button>
                <button className="flex-1 py-2.5 text-sm font-semibold rounded-xl"
                  style={{ background: 'rgba(255,77,109,0.2)', color: '#FF4D6D', border: '1px solid rgba(255,77,109,0.3)' }}
                  onClick={() => { deleteAsset(confirmDelete); setConfirmDelete(null) }}>Hapus</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AssetsPage

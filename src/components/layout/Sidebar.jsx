import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, ArrowLeftRight, Target, Wallet,
  TrendingUp, Bot, LogOut, X, Zap, Edit2, Loader2
} from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../../contexts/AppContext'
import { useAuth } from '../../contexts/AuthContext'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: '#6C63FF' },
  { id: 'transactions', label: 'Transaksi', icon: ArrowLeftRight, color: '#00D4B4' },
  { id: 'goals', label: 'Target Kekayaan', icon: Target, color: '#F5C518' },
  { id: 'assets', label: 'Aset', icon: Wallet, color: '#FF8C42' },
  { id: 'investments', label: 'Investasi', icon: TrendingUp, color: '#8B84FF' },
  { id: 'ai', label: 'AI Assistant', icon: Bot, color: '#FF4D6D' },
]

const Sidebar = () => {
  const { activePage, setActivePage, sidebarOpen, setSidebarOpen } = useApp()
  const { user, signOut, updateDisplayName } = useAuth()

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  const [showEdit, setShowEdit] = useState(false)
  const [newName, setNewName] = useState('')
  const [saving, setSaving] = useState(false)
  const [nameError, setNameError] = useState('')

  const handleOpenEdit = () => {
    setNewName(displayName)
    setNameError('')
    setShowEdit(true)
  }

  const handleSaveName = async () => {
    if (!newName.trim()) { setNameError('Nama tidak boleh kosong'); return }
    if (newName.trim() === displayName) { setShowEdit(false); return }
    setSaving(true)
    const { error } = await updateDisplayName(newName.trim())
    setSaving(false)
    if (error) setNameError('Gagal menyimpan, coba lagi')
    else setShowEdit(false)
  }

  const handleNav = (id) => {
    setActivePage(id)
    setSidebarOpen(false)
  }

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`sidebar glass-card rounded-none border-r flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{
          background: 'linear-gradient(180deg, var(--bg-card) 0%, var(--bg-primary) 100%)',
          borderRightColor: 'var(--glass-border)',
        }}
        initial={false}
      >
        {/* Logo area */}
        <div className="p-5 border-b border-glass-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo icon */}
              <div className="relative w-9 h-9">
                <div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: 'conic-gradient(from 0deg, #6C63FF, #00D4B4, #F5C518, #6C63FF)',
                    animation: 'gradientRotate 4s linear infinite',
                    filter: 'blur(1px)',
                  }}
                />
                <div className="absolute inset-0.5 rounded-[10px] bg-bg-primary flex items-center justify-center">
                  <Zap size={16} className="text-brand-violet" />
                </div>
              </div>
              <div>
                <h1 className="font-display text-base font-bold text-text-primary leading-none">WealthOS</h1>
                <p className="text-text-muted text-[10px] tracking-widest uppercase mt-0.5">Finance</p>
              </div>
            </div>
            <button
              className="lg:hidden btn-glass p-1.5 rounded-lg"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="text-text-muted text-[10px] uppercase tracking-widest mb-3 px-4 font-medium">Menu</p>

          {navItems.map((item, index) => {
            const Icon = item.icon
            const isActive = activePage === item.id

            return (
              <motion.button
                key={item.id}
                className={`nav-item w-full text-left ${isActive ? 'active' : ''}`}
                onClick={() => handleNav(item.id)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.06, duration: 0.3 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: isActive
                      ? `${item.color}20`
                      : 'var(--surface-2)',
                  }}
                >
                  <Icon
                    size={16}
                    style={{ color: isActive ? item.color : 'var(--text-secondary)' }}
                  />
                </div>
                <span className={isActive ? 'text-text-primary' : ''}>{item.label}</span>

                {item.id === 'ai' && (
                  <span className="ml-auto">
                    <span className="badge" style={{ background: 'rgba(255,77,109,0.15)', color: '#FF4D6D', border: '1px solid rgba(255,77,109,0.2)', fontSize: '9px', padding: '1px 6px' }}>
                      AI
                    </span>
                  </span>
                )}
              </motion.button>
            )
          })}
        </nav>

        {/* Bottom area - User info */}
        <div className="p-4 border-t border-glass-border space-y-3">

          {/* User card — klik untuk edit nama */}
          <motion.button
            className="glass-card p-3 rounded-xl flex items-center gap-3 w-full text-left group"
            onClick={handleOpenEdit}
            whileTap={{ scale: 0.98 }}
            title="Klik untuk ganti nama"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold font-display flex-shrink-0 text-white"
              style={{ background: 'linear-gradient(135deg, #6C63FF, #4B44CC)' }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">{displayName}</p>
              <p className="text-xs text-text-secondary truncate">{user?.email}</p>
            </div>
            <Edit2
              size={14}
              className="text-text-muted group-hover:text-brand-violet flex-shrink-0 transition-colors duration-200"
            />
          </motion.button>

          {/* Modal edit nama */}
          <AnimatePresence>
            {showEdit && (
              <motion.div
                className="modal-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={e => e.target === e.currentTarget && setShowEdit(false)}
              >
                <motion.div
                  className="modal-content p-6"
                  initial={{ opacity: 0, scale: 0.96, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 16 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                >
                  {/* Header modal */}
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="font-display text-lg font-bold text-text-primary">✏️ Ganti Nama</h3>
                      <p className="text-text-secondary text-xs mt-0.5">Nama akan berubah di seluruh aplikasi</p>
                    </div>
                    <button
                      className="btn-glass p-2 rounded-xl"
                      onClick={() => setShowEdit(false)}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Avatar preview */}
                  <div className="flex items-center gap-3 p-3 rounded-xl mb-5" style={{ background: 'var(--surface-2)' }}>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold font-display flex-shrink-0 text-white"
                      style={{ background: 'linear-gradient(135deg, #6C63FF, #4B44CC)' }}
                    >
                      {newName ? newName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : initials}
                    </div>
                    <div>
                      <p className="text-text-primary text-sm font-medium">{newName || displayName}</p>
                      <p className="text-text-muted text-xs">{user?.email}</p>
                    </div>
                  </div>

                  {/* Input nama */}
                  <div className="mb-5">
                    <label className="text-text-secondary text-xs font-medium mb-1.5 block uppercase tracking-wider">
                      Nama Baru
                    </label>
                    <input
                      type="text"
                      className="input-premium py-3 px-4 text-sm"
                      placeholder="Masukkan nama..."
                      value={newName}
                      onChange={e => { setNewName(e.target.value); setNameError('') }}
                      onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                      maxLength={40}
                      autoFocus
                    />
                    {nameError && (
                      <p className="text-brand-red text-xs mt-1.5">{nameError}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      className="btn-glass flex-1 py-2.5 text-sm"
                      onClick={() => setShowEdit(false)}
                    >
                      Batal
                    </button>
                    <motion.button
                      className="btn-primary flex-[2] py-2.5 text-sm flex items-center justify-center gap-2"
                      onClick={handleSaveName}
                      disabled={saving || !newName.trim()}
                      whileTap={{ scale: 0.98 }}
                    >
                      {saving && <Loader2 size={15} className="animate-spin" />}
                      {saving ? 'Menyimpan...' : 'Simpan Nama'}
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Logout */}
          <motion.button
            className="w-full nav-item text-text-secondary hover:text-brand-red"
            onClick={signOut}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut size={16} />
            <span className="text-sm">Sign Out</span>
          </motion.button>

          {/* Credit */}
          <p className="text-center text-text-muted text-[10px] pt-1">
            v1.0 · by <span className="text-brand-violet font-medium">Syahrullian</span>
          </p>
        </div>
      </motion.aside>
    </>
  )
}

export default Sidebar

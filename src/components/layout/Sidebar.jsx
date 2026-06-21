import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, ArrowLeftRight, Target, Wallet,
  TrendingUp, Bot, LogOut, X, Zap, ChevronRight,
  Menu
} from 'lucide-react'
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
  const { user, signOut } = useAuth()

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

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
          {/* User card */}
          <div className="glass-card p-3 rounded-xl flex items-center gap-3">
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
          </div>

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

import { motion, AnimatePresence } from 'framer-motion'
import { Menu, RefreshCw, Sparkles } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'
import { useAuth } from '../../contexts/AuthContext'
import { getDailyQuote } from '../../utils/quotes'
import { useState } from 'react'

const pageTitle = {
  dashboard: { title: 'Dashboard', subtitle: 'Overview keuangan hari ini' },
  transactions: { title: 'Transaksi', subtitle: 'Catat pemasukan & pengeluaran' },
  goals: { title: 'Target Kekayaan', subtitle: 'Raih impian finansialmu' },
  assets: { title: 'Aset', subtitle: 'Portofolio aset kamu' },
  investments: { title: 'Investasi', subtitle: 'Performa portofolio investasi' },
  ai: { title: 'AI Assistant', subtitle: 'Analisis keuangan berbasis AI' },
}

const Header = () => {
  const { activePage, setSidebarOpen, fetchAll, loading } = useApp()
  const { user } = useAuth()
  const [showQuote, setShowQuote] = useState(false)

  const currentPage = pageTitle[activePage] || pageTitle.dashboard
  const quote = getDailyQuote()

  const now = new Date()
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  const dateStr = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const hourOfDay = now.getHours()
  const greeting = hourOfDay < 12 ? 'Selamat Pagi' : hourOfDay < 17 ? 'Selamat Siang' : hourOfDay < 20 ? 'Selamat Sore' : 'Selamat Malam'

  const displayName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'User'

  return (
    <header className="sticky top-0 z-20 px-4 lg:px-6 py-4" style={{
      background: 'linear-gradient(180deg, rgba(10,11,15,0.98) 0%, rgba(10,11,15,0) 100%)',
      backdropFilter: 'blur(20px)',
    }}>
      <div className="flex items-center justify-between">
        {/* Left: Hamburger + Page title */}
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden btn-glass p-2 rounded-xl"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div>
            <motion.h2
              key={activePage}
              className="font-display text-lg font-bold text-white leading-none"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {currentPage.title}
            </motion.h2>
            <p className="text-text-secondary text-xs mt-0.5 hidden sm:block">
              {currentPage.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Daily quote button */}
          <div className="relative">
            <motion.button
              className="btn-glass p-2 rounded-xl hidden md:flex items-center gap-2 px-3"
              onClick={() => setShowQuote(!showQuote)}
              whileTap={{ scale: 0.97 }}
            >
              <Sparkles size={15} className="text-brand-gold" />
              <span className="text-xs text-text-secondary">Quote Hari Ini</span>
            </motion.button>

            <AnimatePresence>
              {showQuote && (
                <motion.div
                  className="absolute right-0 top-full mt-2 glass-card p-4 rounded-2xl w-72 z-50"
                  style={{ background: 'rgba(17,19,24,0.98)' }}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(245,197,24,0.15)' }}>
                      <Sparkles size={14} className="text-brand-gold" />
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium leading-relaxed italic">
                        "{quote.quote}"
                      </p>
                      <p className="text-text-secondary text-xs mt-2">— {quote.author}</p>
                    </div>
                  </div>
                  <button
                    className="absolute top-2 right-2 text-text-muted hover:text-white p-1"
                    onClick={() => setShowQuote(false)}
                  >✕</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Refresh */}
          <motion.button
            className="btn-glass p-2 rounded-xl"
            onClick={fetchAll}
            disabled={loading}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: loading ? 360 : 0 }}
              transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: 'linear' }}
            >
              <RefreshCw size={16} className="text-text-secondary" />
            </motion.div>
          </motion.button>

          {/* Date badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl" style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div className="status-dot online" />
            <div className="text-right">
              <p className="text-white text-xs font-mono font-medium">{timeStr}</p>
              <p className="text-text-muted text-[10px]">{dateStr}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Greeting bar - dashboard only */}
      {activePage === 'dashboard' && (
        <motion.div
          className="mt-3 p-3 rounded-xl flex items-center gap-3"
          style={{
            background: 'linear-gradient(135deg, rgba(108,99,255,0.08), rgba(0,212,180,0.05))',
            border: '1px solid rgba(108,99,255,0.15)',
          }}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-xl">👋</span>
          <div>
            <p className="text-white text-sm font-medium">
              {greeting}, <span className="text-gradient-violet font-semibold">{displayName}</span>!
            </p>
            <p className="text-text-secondary text-xs">
              Pantau keuangan kamu dan terus tingkatkan kekayaan bersihmu hari ini.
            </p>
          </div>
          <div className="ml-auto hidden sm:block">
            <span className="badge badge-neutral text-xs">
              ✨ {new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(now)}
            </span>
          </div>
        </motion.div>
      )}
    </header>
  )
}

export default Header

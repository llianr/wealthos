import { motion } from 'framer-motion'
import { LayoutDashboard, ArrowLeftRight, Target, Wallet, TrendingUp } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'

const mobileNavItems = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transaksi', icon: ArrowLeftRight },
  { id: 'goals', label: 'Target', icon: Target },
  { id: 'assets', label: 'Aset', icon: Wallet },
  { id: 'investments', label: 'Investasi', icon: TrendingUp },
]

const MobileNav = () => {
  const { activePage, setActivePage } = useApp()

  return (
    <nav className="mobile-nav">
      <div className="flex w-full">
        {mobileNavItems.map(item => {
          const Icon = item.icon
          const isActive = activePage === item.id

          return (
            <button
              key={item.id}
              className="flex-1 flex flex-col items-center gap-1 py-2 px-1 relative"
              onClick={() => setActivePage(item.id)}
            >
              {isActive && (
                <motion.div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 rounded-full"
                  style={{ background: 'linear-gradient(90deg, #6C63FF, #00D4B4)' }}
                  layoutId="mobileNavIndicator"
                  transition={{ type: 'spring', damping: 20 }}
                />
              )}
              <div
                className="p-2 rounded-xl transition-all duration-200"
                style={{
                  background: isActive ? 'rgba(108,99,255,0.15)' : 'transparent',
                }}
              >
                <Icon
                  size={20}
                  style={{ color: isActive ? '#6C63FF' : 'var(--text-secondary)' }}
                />
              </div>
              <span
                className="text-[10px] font-medium"
                style={{ color: isActive ? '#6C63FF' : 'var(--text-secondary)' }}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default MobileNav

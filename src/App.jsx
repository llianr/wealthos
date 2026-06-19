import { AnimatePresence, motion } from 'framer-motion'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { AppProvider, useApp } from './contexts/AppContext'

import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import MobileNav from './components/layout/MobileNav'
import Toast from './components/layout/Toast'
import MusicPlayer from './components/music/MusicPlayer'

import AuthPage from './components/auth/AuthPage'
import Dashboard from './components/dashboard/Dashboard'
import TransactionPage from './components/transactions/TransactionPage'
import GoalsPage from './components/goals/GoalsPage'
import AssetsPage from './components/assets/AssetsPage'
import InvestmentsPage from './components/investments/InvestmentsPage'
import AIAssistant from './components/ai/AIAssistant'

// Page content router
const PageContent = () => {
  const { activePage } = useApp()

  const pages = {
    dashboard: <Dashboard />,
    transactions: <TransactionPage />,
    goals: <GoalsPage />,
    assets: <AssetsPage />,
    investments: <InvestmentsPage />,
    ai: <AIAssistant />,
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activePage}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
      >
        {pages[activePage] || pages.dashboard}
      </motion.div>
    </AnimatePresence>
  )
}

// Main app layout (authenticated)
const AppLayout = () => {
  return (
    <div className="flex min-h-screen mesh-bg">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="main-content flex flex-col flex-1 min-w-0">
        {/* Header */}
        <Header />

        {/* Page content */}
        <main className="flex-1 px-4 lg:px-6 pb-4">
          <PageContent />
        </main>

        {/* Music player - fixed to bottom of main content */}
        <div className="sticky bottom-0 z-10">
          <MusicPlayer />
        </div>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav />

      {/* Toast notifications */}
      <Toast />
    </div>
  )
}

// Simple, stable spinner shown only while Supabase resolves the session
const AuthLoading = () => (
  <div className="min-h-screen mesh-bg flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-brand-violet/30 animate-spin" />
        <div
          className="absolute inset-2 rounded-full border-2 border-t-brand-violet border-transparent animate-spin"
          style={{ animationDuration: '0.7s' }}
        />
      </div>
      <p className="text-text-secondary text-sm font-mono">Loading WealthOS...</p>
    </div>
  </div>
)

// Auth gate: loading -> AuthPage (no user) -> AppLayout (user)
const AuthGate = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return <AuthLoading />
  }

  if (!user) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <AuthPage />
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <AppProvider>
        <AppLayout />
      </AppProvider>
    </motion.div>
  )
}

// Root App
const App = () => {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  )
}

export default App

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Info } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'

const Toast = () => {
  const { toast } = useApp()

  const configs = {
    success: {
      icon: CheckCircle,
      color: '#00D4B4',
      bg: 'rgba(0,212,180,0.1)',
      border: 'rgba(0,212,180,0.2)',
    },
    error: {
      icon: XCircle,
      color: '#FF4D6D',
      bg: 'rgba(255,77,109,0.1)',
      border: 'rgba(255,77,109,0.2)',
    },
    info: {
      icon: Info,
      color: '#6C63FF',
      bg: 'rgba(108,99,255,0.1)',
      border: 'rgba(108,99,255,0.2)',
    },
  }

  return (
    <div className="fixed top-4 right-4 z-[200] pointer-events-none">
      <AnimatePresence>
        {toast && (() => {
          const config = configs[toast.type] || configs.success
          const Icon = config.icon
          return (
            <motion.div
              key={toast.id}
              className="flex items-center gap-3 px-4 py-3 rounded-xl pointer-events-auto"
              style={{
                background: 'rgba(17,19,24,0.98)',
                border: `1px solid ${config.border}`,
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                minWidth: '240px',
                maxWidth: '320px',
              }}
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: config.bg }}
              >
                <Icon size={16} style={{ color: config.color }} />
              </div>
              <p className="text-white text-sm font-medium">{toast.message}</p>
            </motion.div>
          )
        })()}
      </AnimatePresence>
    </div>
  )
}

export default Toast

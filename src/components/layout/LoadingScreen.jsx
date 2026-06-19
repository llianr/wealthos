import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState('boot')

  useEffect(() => {
    const phases = [
      { delay: 200, progress: 30, phase: 'init' },
      { delay: 800, progress: 65, phase: 'data' },
      { delay: 1400, progress: 85, phase: 'ready' },
      { delay: 2000, progress: 100, phase: 'done' },
    ]

    phases.forEach(({ delay, progress, phase }) => {
      setTimeout(() => {
        setProgress(progress)
        setPhase(phase)
      }, delay)
    })

    setTimeout(() => {
      onComplete?.()
    }, 2800)
  }, [onComplete])

  const phaseText = {
    boot: 'Initializing WealthOS...',
    init: 'Loading financial data...',
    data: 'Connecting to secure vault...',
    ready: 'Preparing your dashboard...',
    done: 'Welcome back! 🚀',
  }

  return (
    <motion.div
      className="loading-screen mesh-bg"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      {/* Background orbs */}
      <div className="orb" style={{
        width: 400, height: 400,
        background: 'rgba(108,99,255,0.15)',
        top: '10%', left: '10%',
        animationDelay: '0s',
      }} />
      <div className="orb" style={{
        width: 300, height: 300,
        background: 'rgba(0,212,180,0.1)',
        bottom: '20%', right: '15%',
        animationDelay: '-3s',
      }} />

      {/* Main content */}
      <div className="flex flex-col items-center gap-8 z-10 relative">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative"
        >
          {/* Rotating gradient ring */}
          <div className="relative w-24 h-24">
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'conic-gradient(from 0deg, #6C63FF, #00D4B4, #F5C518, #6C63FF)',
                filter: 'blur(2px)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
            <div className="absolute inset-1 rounded-full bg-bg-primary flex items-center justify-center">
              <span className="text-4xl font-display font-bold text-gradient-wealth">W</span>
            </div>
          </div>
        </motion.div>

        {/* Brand name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center"
        >
          <h1 className="font-display text-4xl font-bold text-gradient-wealth mb-1">
            WealthOS
          </h1>
          <p className="text-text-secondary text-sm tracking-widest uppercase">
            Financial Command Center
          </p>
        </motion.div>

        {/* Progress section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="w-64 space-y-3"
        >
          {/* Progress bar */}
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #6C63FF, #00D4B4, #F5C518)',
              }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </div>

          {/* Status text */}
          <div className="flex items-center justify-between">
            <AnimatePresence mode="wait">
              <motion.p
                key={phase}
                className="text-text-secondary text-xs font-mono"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                {phaseText[phase]}
              </motion.p>
            </AnimatePresence>
            <span className="text-brand-violet text-xs font-mono">{progress}%</span>
          </div>
        </motion.div>

        {/* Decorative dots */}
        <motion.div
          className="flex gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-brand-violet"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default LoadingScreen

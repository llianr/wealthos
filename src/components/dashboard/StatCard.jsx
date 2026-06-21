import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = '#6C63FF',
  change,
  changeLabel,
  delay = 0,
  isPrimary = false,
  isNetWorth = false,
}) => {
  const changePositive = change > 0
  const changeZero = change === 0 || change === undefined || change === null

  return (
    <motion.div
      className="glass-card p-5 rounded-2xl relative overflow-hidden"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-[0.06] rounded-2xl"
        style={{ background: `radial-gradient(circle at top right, ${color}, transparent 70%)` }}
      />

      {/* Wealth pulse effect for net worth card */}
      {isNetWorth && (
        <div className="absolute inset-0 rounded-2xl" style={{
          background: `conic-gradient(from 0deg, ${color}15, transparent, ${color}10, transparent)`,
          animation: 'gradientRotate 6s linear infinite',
        }} />
      )}

      <div className="relative z-10">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-text-secondary text-xs font-medium uppercase tracking-wider">{title}</p>
          </div>
          {/* Icon */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${color}18`, border: `1px solid ${color}25` }}
          >
            <Icon size={17} style={{ color }} />
          </div>
        </div>

        {/* Value */}
        <motion.div
          className={`font-display font-bold leading-none mb-2 ${isNetWorth ? 'text-3xl text-gradient-wealth' : 'text-2xl text-text-primary'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.2, duration: 0.5 }}
        >
          {value}
        </motion.div>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-text-muted text-xs mb-2">{subtitle}</p>
        )}

        {/* Change indicator */}
        {!changeZero && (
          <div className="flex items-center gap-1">
            <div
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
              style={{
                background: changePositive ? 'rgba(0,212,180,0.15)' : 'rgba(255,77,109,0.15)',
                color: changePositive ? '#00D4B4' : '#FF4D6D',
              }}
            >
              {changePositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {Math.abs(change).toFixed(1)}%
            </div>
            {changeLabel && <span className="text-text-muted text-xs">{changeLabel}</span>}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default StatCard

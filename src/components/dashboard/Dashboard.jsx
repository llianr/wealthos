import { motion } from 'framer-motion'
import { useMemo } from 'react'
import {
  Wallet, TrendingUp, BarChart2,
  Activity, ArrowUpRight, ArrowDownRight, Layers, Zap
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { useApp } from '../../contexts/AppContext'
import StatCard from './StatCard'
import { formatIDR, formatDateShort, getMonthYear } from '../../utils/formatters'
import { getDailyQuote as getQuote } from '../../utils/quotes'

const CHART_COLORS = {
  income: '#00D4B4',
  expense: '#FF4D6D',
  net: '#6C63FF',
  wealth: '#F5C518',
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="custom-tooltip">
      <p className="text-text-secondary text-xs mb-2 font-medium">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-text-secondary">{entry.name}:</span>
          <span className="text-white font-medium font-mono">{formatIDR(entry.value, true)}</span>
        </div>
      ))}
    </div>
  )
}

const Dashboard = () => {
  const {
    transactions, assets, investments,
    totalIncome, totalExpense, totalAssets, totalInvestments,
    netWorth, monthlyNet, netWorthChange,
  } = useApp()

  const quote = getQuote()

  // Build monthly chart data (last 6 months)
  const chartData = useMemo(() => {
    const months = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const m = d.getMonth()
      const y = d.getFullYear()

      const monthTx = transactions.filter(t => {
        const td = new Date(t.date)
        return td.getMonth() === m && td.getFullYear() === y
      })

      const income = monthTx.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
      const expense = monthTx.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)

      months.push({
        name: new Intl.DateTimeFormat('id-ID', { month: 'short' }).format(d),
        Pemasukan: income,
        Pengeluaran: expense,
        Tabungan: Math.max(0, income - expense),
      })
    }
    return months
  }, [transactions])

  // Asset breakdown for pie
  const assetPieData = useMemo(() => {
    const grouped = {}
    assets.forEach(a => {
      const key = a.type || 'lainnya'
      grouped[key] = (grouped[key] || 0) + Number(a.current_value || a.value || 0)
    })
    const colors = ['#6C63FF', '#00D4B4', '#F5C518', '#FF8C42', '#FF4D6D', '#8B84FF', '#00A890']
    return Object.entries(grouped).map(([name, value], i) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: colors[i % colors.length],
    })).filter(d => d.value > 0)
  }, [assets])

  // Recent transactions
  const recentTx = transactions.slice(0, 5)

  // Investment performance
  const totalModalInvestasi = investments.reduce((s, i) => s + Number(i.modal || 0), 0)
  const totalPnL = totalInvestments - totalModalInvestasi
  const totalROI = totalModalInvestasi > 0 ? ((totalPnL / totalModalInvestasi) * 100) : 0

  return (
    <div className="space-y-6 pb-24 lg:pb-8">
      {/* Net Worth Hero Card */}
      <motion.div
        className="glass-card rounded-3xl p-6 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: 'linear-gradient(135deg, rgba(108,99,255,0.12) 0%, rgba(17,19,24,0.98) 50%, rgba(0,212,180,0.08) 100%)',
        }}
      >
        {/* Animated border */}
        <div className="absolute inset-0 rounded-3xl" style={{
          background: 'linear-gradient(135deg, rgba(108,99,255,0.3), transparent, rgba(0,212,180,0.2))',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          padding: '1px',
        }} />

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{
          background: 'radial-gradient(circle, #6C63FF, transparent)',
          transform: 'translate(30%, -30%)',
        }} />

        <div className="relative z-10">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-text-secondary text-xs uppercase tracking-widest font-medium mb-2">
                💎 Total Net Worth
              </p>
              <motion.h3
                className="font-display text-4xl lg:text-5xl font-bold text-gradient-wealth number"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', damping: 15 }}
              >
                {formatIDR(netWorth)}
              </motion.h3>
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <div className={`flex items-center gap-1 text-sm font-medium ${monthlyNet >= 0 ? 'text-brand-teal' : 'text-brand-red'}`}>
                  {monthlyNet >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  {formatIDR(Math.abs(monthlyNet), true)} bulan ini
                </div>
                <div className="h-4 w-px bg-white/10" />
                <span className="text-text-secondary text-sm">
                  Aset + Investasi
                </span>
              </div>
            </div>

            {/* Right stats mini */}
            <div className="flex gap-4">
              <div className="text-right">
                <p className="text-text-muted text-xs mb-1">Aset</p>
                <p className="text-white font-mono font-semibold text-lg">{formatIDR(totalAssets, true)}</p>
              </div>
              <div className="text-right">
                <p className="text-text-muted text-xs mb-1">Investasi</p>
                <p className="text-white font-mono font-semibold text-lg">{formatIDR(totalInvestments, true)}</p>
              </div>
              <div className="text-right">
                <p className="text-text-muted text-xs mb-1">ROI</p>
                <p className={`font-mono font-semibold text-lg ${totalROI >= 0 ? 'text-brand-teal' : 'text-brand-red'}`}>
                  {totalROI >= 0 ? '+' : ''}{totalROI.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard
          title="Pemasukan Bulan Ini"
          value={formatIDR(totalIncome)}
          icon={ArrowUpRight}
          color="#00D4B4"
          subtitle={getMonthYear()}
          delay={0.1}
        />
        <StatCard
          title="Pengeluaran Bulan Ini"
          value={formatIDR(totalExpense)}
          icon={ArrowDownRight}
          color="#FF4D6D"
          subtitle={getMonthYear()}
          delay={0.15}
        />
        <StatCard
          title="Total Aset"
          value={formatIDR(totalAssets)}
          icon={Wallet}
          color="#F5C518"
          subtitle={`${assets.length} jenis aset`}
          delay={0.2}
        />
        <StatCard
          title="Portfolio Investasi"
          value={formatIDR(totalInvestments)}
          icon={TrendingUp}
          color="#6C63FF"
          subtitle={`P&L: ${totalPnL >= 0 ? '+' : ''}${formatIDR(totalPnL, true)}`}
          change={totalROI}
          changeLabel="ROI"
          delay={0.25}
        />
      </div>

      {/* Charts row */}
      <div className="charts-grid">
        {/* Income vs Expense Chart */}
        <motion.div
          className="glass-card p-5 rounded-2xl"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display font-semibold text-white">Pemasukan vs Pengeluaran</h3>
              <p className="text-text-secondary text-xs mt-0.5">6 bulan terakhir</p>
            </div>
            <BarChart2 size={18} className="text-text-muted" />
          </div>

          {transactions.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-text-muted text-sm">
              <div className="text-center">
                <BarChart2 size={32} className="mx-auto mb-2 opacity-30" />
                <p>Belum ada data transaksi</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#8B92A5', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#8B92A5', fontSize: 10 }} axisLine={false} tickLine={false}
                  tickFormatter={v => formatIDR(v, true)} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Pemasukan" fill="#00D4B4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Pengeluaran" fill="#FF4D6D" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Wealth Growth Chart */}
        <motion.div
          className="glass-card p-5 rounded-2xl"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display font-semibold text-white">Pertumbuhan Tabungan</h3>
              <p className="text-text-secondary text-xs mt-0.5">Akumulasi 6 bulan</p>
            </div>
            <Activity size={18} className="text-text-muted" />
          </div>

          {transactions.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-text-muted text-sm">
              <div className="text-center">
                <Activity size={32} className="mx-auto mb-2 opacity-30" />
                <p>Belum ada data</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="tabunganGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#8B92A5', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#8B92A5', fontSize: 10 }} axisLine={false} tickLine={false}
                  tickFormatter={v => formatIDR(v, true)} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="Tabungan" stroke="#6C63FF" strokeWidth={2}
                  fill="url(#tabunganGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>

      {/* Bottom row: Recent Tx + Asset Pie */}
      <div className="charts-grid">
        {/* Recent Transactions */}
        <motion.div
          className="glass-card p-5 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-white">Transaksi Terbaru</h3>
            <Zap size={16} className="text-text-muted" />
          </div>

          {recentTx.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-text-muted text-sm">
              <div className="text-center">
                <p className="text-2xl mb-2">📭</p>
                <p>Belum ada transaksi</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {recentTx.map((tx, i) => (
                <motion.div
                  key={tx.id}
                  className="transaction-item"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base"
                    style={{
                      background: tx.type === 'income' ? 'rgba(0,212,180,0.1)' : 'rgba(255,77,109,0.1)',
                    }}
                  >
                    {tx.type === 'income' ? '↑' : '↓'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{tx.description || tx.category}</p>
                    <p className="text-text-muted text-xs">{formatDateShort(tx.date)} · {tx.category}</p>
                  </div>
                  <span
                    className="font-mono text-sm font-semibold flex-shrink-0"
                    style={{ color: tx.type === 'income' ? '#00D4B4' : '#FF4D6D' }}
                  >
                    {tx.type === 'income' ? '+' : '-'}{formatIDR(tx.amount, true)}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Asset Breakdown */}
        <motion.div
          className="glass-card p-5 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-white">Komposisi Aset</h3>
            <Layers size={16} className="text-text-muted" />
          </div>

          {assetPieData.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-text-muted text-sm">
              <div className="text-center">
                <p className="text-2xl mb-2">💼</p>
                <p>Belum ada aset dicatat</p>
              </div>
            </div>
          ) : (
            <div>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={assetPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    dataKey="value"
                    paddingAngle={3}
                  >
                    {assetPieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-1.5 mt-2">
                {assetPieData.map((entry, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: entry.color }} />
                    <span className="text-text-secondary truncate">{entry.name}</span>
                    <span className="text-white font-mono ml-auto">{formatIDR(entry.value, true)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Motivational Quote */}
      <motion.div
        className="glass-card p-5 rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(245,197,24,0.08) 0%, rgba(17,19,24,0.9) 100%)',
          borderColor: 'rgba(245,197,24,0.15)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-start gap-4">
          <div className="text-3xl flex-shrink-0 animate-pulse-slow">✨</div>
          <div>
            <p className="text-xs text-brand-gold font-medium uppercase tracking-widest mb-2">Quote Hari Ini</p>
            <p className="text-white text-sm leading-relaxed italic font-medium">
              "{quote.quote}"
            </p>
            <p className="text-text-secondary text-xs mt-2 font-medium">— {quote.author}</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard

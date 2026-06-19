import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { Send, Bot, Sparkles, Loader2, RotateCcw, User } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'
import { formatIDR, getCategoryInfo } from '../../utils/formatters'

const QUICK_PROMPTS = [
  { label: '💸 Pengeluaran terbesar', prompt: 'Apa pengeluaran terbesar saya bulan ini?' },
  { label: '📊 Kemana uang saya?', prompt: 'Kemana uang saya paling banyak keluar?' },
  { label: '📅 Rata-rata harian', prompt: 'Berapa rata-rata pengeluaran harian saya?' },
  { label: '🎯 Estimasi target', prompt: 'Berapa lama lagi saya mencapai target kekayaan saya?' },
  { label: '💡 Saran tabungan', prompt: 'Apa saran terbaik untuk meningkatkan tabungan saya?' },
  { label: '📈 Analisis investasi', prompt: 'Bagaimana performa investasi saya saat ini?' },
]

const buildContext = (data) => {
  const { transactions, goals, assets, investments, totalIncome, totalExpense, netWorth, monthlyNet } = data

  const now = new Date()
  const thisMonth = transactions.filter(t => {
    const d = new Date(t.date)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })

  // Expense by category
  const expByCategory = {}
  thisMonth.filter(t => t.type === 'expense').forEach(t => {
    expByCategory[t.category] = (expByCategory[t.category] || 0) + Number(t.amount)
  })

  // Top expenses
  const topExpenses = Object.entries(expByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([cat, amt]) => `- ${getCategoryInfo(cat, 'expense').label}: ${formatIDR(amt)}`)
    .join('\n')

  // Investments summary
  const totalModal = investments.reduce((s, i) => s + Number(i.modal || 0), 0)
  const totalInvNow = investments.reduce((s, i) => s + Number(i.current_value || i.modal || 0), 0)
  const totalROI = totalModal > 0 ? ((totalInvNow - totalModal) / totalModal * 100).toFixed(2) : 0

  // Goals
  const goalsText = goals.map(g =>
    `- ${g.emoji || ''} ${g.title}: terkumpul ${formatIDR(g.current_amount)} dari ${formatIDR(g.target_amount)} (${((g.current_amount / g.target_amount) * 100).toFixed(1)}%)`
  ).join('\n')

  // Daily avg this month
  const daysInMonth = now.getDate()
  const dailyAvg = thisMonth.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0) / daysInMonth

  return `Kamu adalah WealthOS AI, asisten keuangan pribadi yang cerdas, supportif, dan berbicara dalam Bahasa Indonesia yang santai tapi profesional.

DATA KEUANGAN USER (REAL-TIME):
===================================
📅 Tanggal: ${now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}

💰 RINGKASAN BULAN INI:
- Pemasukan: ${formatIDR(totalIncome)}
- Pengeluaran: ${formatIDR(totalExpense)}
- Saldo bersih: ${formatIDR(monthlyNet)}
- Rata-rata pengeluaran harian: ${formatIDR(dailyAvg)}

💎 KEKAYAAN BERSIH (NET WORTH):
- Total: ${formatIDR(netWorth)}
- Total Aset: ${formatIDR(assets.reduce((s, a) => s + Number(a.current_value || a.value || 0), 0))}
- Total Investasi: ${formatIDR(totalInvNow)}
- P&L Investasi: ${totalROI >= 0 ? '+' : ''}${totalROI}%

📊 PENGELUARAN TERBESAR BULAN INI:
${topExpenses || '(belum ada data)'}

🎯 TARGET KEKAYAAN:
${goalsText || '(belum ada target)'}

📈 INVESTASI:
- Total modal: ${formatIDR(totalModal)}
- Nilai saat ini: ${formatIDR(totalInvNow)}
- Total ROI: ${totalROI >= 0 ? '+' : ''}${totalROI}%

📋 TOTAL TRANSAKSI: ${transactions.length} transaksi
===================================

INSTRUKSI:
- Jawab dalam Bahasa Indonesia yang santai, friendly, dan langsung to the point
- Berikan insight yang actionable dan spesifik berdasarkan data di atas
- Gunakan angka dan persentase yang konkret dari data user
- Gunakan emoji secukupnya untuk membuat respons lebih menarik
- Format jawaban dengan rapi (bisa pakai bullet points jika perlu)
- Jika data kurang, minta user untuk menambahkan data terlebih dahulu
- Berikan motivasi dan saran yang membangun di akhir jawaban
- Maksimal 300 kata per respons`
}

const AIAssistant = () => {
  const appData = useApp()
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: `Halo! 👋 Aku adalah **WealthOS AI**, asisten keuangan pribadimu yang siap membantu menganalisis kondisi keuanganmu.\n\nAku bisa bantu kamu:\n- 📊 Analisis pengeluaran & pemasukan\n- 🎯 Estimasi pencapaian target kekayaan\n- 💡 Saran meningkatkan tabungan\n- 📈 Review performa investasi\n\nMau tanya apa hari ini? 😊`,
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text) => {
    const userMsg = text || input.trim()
    if (!userMsg || loading) return

    setInput('')
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', content: userMsg }])
    setLoading(true)

    try {
      const systemPrompt = buildContext(appData)

      // Build conversation history for API
      const history = messages.slice(-6).map(m => ({
        role: m.role,
        content: m.content
      }))

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: systemPrompt,
          messages: [...history, { role: 'user', content: userMsg }],
        }),
      })

      if (!response.ok) throw new Error(`API error: ${response.status}`)

      const data = await response.json()
      const reply = data.content?.[0]?.text || 'Maaf, terjadi kesalahan. Coba lagi ya!'

      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'assistant',
        content: reply,
      }])
    } catch (err) {
      console.error('AI error:', err)
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'assistant',
        content: '⚠️ Koneksi ke AI terputus. Pastikan API key sudah dikonfigurasi dengan benar, atau coba lagi dalam beberapa saat.',
      }])
    } finally {
      setLoading(false)
    }
  }

  const resetChat = () => {
    setMessages([{
      id: Date.now(),
      role: 'assistant',
      content: `Chat direset! 🔄 Halo lagi! Aku siap membantu analisis keuanganmu. Mau tanya apa?`,
    }])
  }

  const renderContent = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>')
  }

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] min-h-[500px] pb-0">
      {/* Header */}
      <motion.div
        className="glass-card p-4 rounded-2xl mb-4 flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg, rgba(255,77,109,0.08), rgba(17,19,24,0.98))' }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6C63FF, #FF4D6D)' }}>
              <Bot size={22} className="text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-brand-teal border-2 border-bg-primary" />
          </div>
          <div>
            <p className="font-display font-semibold text-white text-sm">WealthOS AI</p>
            <p className="text-text-secondary text-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-teal inline-block" />
              Powered by Claude · Terhubung ke data keuanganmu
            </p>
          </div>
        </div>
        <button className="btn-glass p-2 rounded-xl text-text-secondary hover:text-white"
          onClick={resetChat} title="Reset chat">
          <RotateCcw size={15} />
        </button>
      </motion.div>

      {/* Quick prompts */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {QUICK_PROMPTS.map((qp, i) => (
          <motion.button key={i}
            className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all"
            style={{
              background: 'rgba(108,99,255,0.1)',
              border: '1px solid rgba(108,99,255,0.2)',
              color: '#8B84FF',
            }}
            onClick={() => sendMessage(qp.prompt)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}>
            {qp.label}
          </motion.button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}>

              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center
                ${msg.role === 'assistant'
                  ? 'bg-gradient-to-br from-brand-violet to-brand-red'
                  : 'bg-gradient-to-br from-brand-teal to-brand-violet'}`}>
                {msg.role === 'assistant'
                  ? <Bot size={16} className="text-white" />
                  : <User size={16} className="text-white" />}
              </div>

              {/* Bubble */}
              <div className={`ai-message ${msg.role}`}
                dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }}
                style={{ color: msg.role === 'assistant' ? '#e2e8f0' : '#ffffff' }}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {loading && (
          <motion.div className="flex gap-3 items-end"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6C63FF, #FF4D6D)' }}>
              <Bot size={16} className="text-white" />
            </div>
            <div className="ai-message assistant flex items-center gap-2 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div key={i} className="w-2 h-2 rounded-full bg-brand-violet"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
                ))}
              </div>
              <span className="text-text-secondary text-xs">AI sedang berpikir...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <motion.div
        className="glass-card p-3 rounded-2xl mt-2"
        style={{ background: 'rgba(17,19,24,0.98)' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex gap-3 items-end">
          <textarea
            ref={inputRef}
            className="flex-1 bg-transparent text-white text-sm resize-none outline-none placeholder-text-muted"
            placeholder="Tanya sesuatu tentang keuanganmu..."
            rows={1}
            value={input}
            onChange={e => {
              setInput(e.target.value)
              e.target.style.height = 'auto'
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
            style={{ minHeight: '24px', maxHeight: '120px' }}
          />
          <motion.button
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: input.trim() && !loading
                ? 'linear-gradient(135deg, #6C63FF, #4B44CC)'
                : 'rgba(255,255,255,0.06)',
            }}
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            whileTap={{ scale: 0.9 }}
          >
            {loading
              ? <Loader2 size={16} className="text-white animate-spin" />
              : <Send size={16} className={input.trim() ? 'text-white' : 'text-text-muted'} />}
          </motion.button>
        </div>
        <p className="text-text-muted text-[10px] mt-2 text-center">
          AI menganalisis data keuangan realtime kamu · Enter untuk kirim
        </p>
      </motion.div>
    </div>
  )
}

export default AIAssistant

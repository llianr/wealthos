import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, User, Zap, ArrowRight, Loader2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const AuthPage = () => {
  const { signIn, signUp, resetPassword } = useAuth()
  const [mode, setMode] = useState('login') // login | register | reset
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  })

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (mode === 'login') {
        const { error } = await signIn(form.email, form.password)
        if (error) setError(error.message)
      } else if (mode === 'register') {
        if (form.password !== form.confirmPassword) {
          setError('Password tidak cocok!')
          setLoading(false)
          return
        }
        if (form.password.length < 6) {
          setError('Password minimal 6 karakter')
          setLoading(false)
          return
        }
        const { error } = await signUp(form.email, form.password, form.fullName)
        if (error) setError(error.message)
        else setSuccess('Cek email kamu untuk verifikasi! 📧')
      } else if (mode === 'reset') {
        const { error } = await resetPassword(form.email)
        if (error) setError(error.message)
        else setSuccess('Link reset password sudah dikirim ke email kamu! 📧')
      }
    } catch {
      setError('Terjadi kesalahan. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center p-4">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="orb" style={{ width: 500, height: 500, background: 'rgba(108,99,255,0.12)', top: '-10%', left: '-10%' }} />
        <div className="orb" style={{ width: 400, height: 400, background: 'rgba(0,212,180,0.08)', bottom: '-5%', right: '-5%', animationDelay: '-4s' }} />
        <div className="orb" style={{ width: 300, height: 300, background: 'rgba(245,197,24,0.05)', top: '40%', right: '20%', animationDelay: '-7s' }} />
      </div>

      {/* Grid lines decorative */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center gap-3 mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', damping: 15 }}
          >
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-2xl" style={{
                background: 'conic-gradient(from 0deg, #6C63FF, #00D4B4, #F5C518, #6C63FF)',
                animation: 'gradientRotate 4s linear infinite',
                filter: 'blur(1px)',
              }} />
              <div className="absolute inset-0.5 rounded-[14px] bg-bg-primary flex items-center justify-center">
                <Zap size={20} className="text-brand-violet" />
              </div>
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-gradient-wealth">WealthOS</h1>
              <p className="text-text-muted text-xs tracking-widest uppercase">Financial Command Center</p>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="font-display text-2xl font-bold text-text-primary mb-1">
                {mode === 'login' ? 'Selamat datang kembali 👋' : mode === 'register' ? 'Buat akun gratis' : 'Reset password'}
              </h2>
              <p className="text-text-secondary text-sm">
                {mode === 'login' ? 'Masuk ke financial command center kamu' : mode === 'register' ? 'Mulai perjalanan kebebasan finansialmu' : 'Masukkan emailmu untuk reset password'}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Card */}
        <motion.div
          className="glass-card p-6 rounded-3xl"
          style={{ background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-primary) 100%)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Error/Success */}
          <AnimatePresence>
            {(error || success) && (
              <motion.div
                className={`mb-4 p-3 rounded-xl text-sm font-medium ${error ? 'text-brand-red' : 'text-brand-teal'}`}
                style={{
                  background: error ? 'rgba(255,77,109,0.1)' : 'rgba(0,212,180,0.1)',
                  border: `1px solid ${error ? 'rgba(255,77,109,0.2)' : 'rgba(0,212,180,0.2)'}`,
                }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {error || success}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full name - register only */}
            <AnimatePresence>
              {mode === 'register' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="text-text-secondary text-xs font-medium mb-1.5 block">Nama Lengkap</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      type="text"
                      className="input-premium pl-10 pr-4 py-3 text-sm"
                      placeholder="Nama lengkap kamu"
                      value={form.fullName}
                      onChange={e => update('fullName', e.target.value)}
                      required={mode === 'register'}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div>
              <label className="text-text-secondary text-xs font-medium mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="email"
                  className="input-premium pl-10 pr-4 py-3 text-sm"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password - not in reset mode */}
            <AnimatePresence>
              {mode !== 'reset' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="text-text-secondary text-xs font-medium mb-1.5 block">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      className="input-premium pl-10 pr-12 py-3 text-sm"
                      placeholder={mode === 'register' ? 'Min. 6 karakter' : 'Password kamu'}
                      value={form.password}
                      onChange={e => update('password', e.target.value)}
                      required={mode !== 'reset'}
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                      onClick={() => setShowPass(!showPass)}
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Confirm password - register only */}
            <AnimatePresence>
              {mode === 'register' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="text-text-secondary text-xs font-medium mb-1.5 block">Konfirmasi Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      className="input-premium pl-10 pr-4 py-3 text-sm"
                      placeholder="Ulangi password"
                      value={form.confirmPassword}
                      onChange={e => update('confirmPassword', e.target.value)}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Forgot password link */}
            {mode === 'login' && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-brand-violet text-xs hover:underline"
                  onClick={() => { setMode('reset'); setError(''); setSuccess('') }}
                >
                  Lupa password?
                </button>
              </div>
            )}

            {/* Submit */}
            <motion.button
              type="submit"
              className="btn-primary w-full py-3.5 text-sm font-semibold flex items-center justify-center gap-2 mt-6"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Masuk ke WealthOS' : mode === 'register' ? 'Buat Akun' : 'Kirim Link Reset'}
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          {/* Mode switcher */}
          <div className="divider my-5" />

          <div className="text-center text-sm">
            {mode === 'login' ? (
              <p className="text-text-secondary">
                Belum punya akun?{' '}
                <button
                  className="text-brand-violet font-medium hover:underline"
                  onClick={() => { setMode('register'); setError(''); setSuccess('') }}
                >
                  Daftar sekarang
                </button>
              </p>
            ) : (
              <p className="text-text-secondary">
                Sudah punya akun?{' '}
                <button
                  className="text-brand-violet font-medium hover:underline"
                  onClick={() => { setMode('login'); setError(''); setSuccess('') }}
                >
                  Masuk
                </button>
              </p>
            )}
          </div>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-text-muted text-xs mt-6">
          Data kamu aman & terenkripsi 🔒
        </p>
        <p className="text-center text-text-muted text-[11px] mt-2">
          Crafted by <span className="text-brand-violet font-medium">Syahrullian</span>
        </p>
      </motion.div>
    </div>
  )
}

export default AuthPage

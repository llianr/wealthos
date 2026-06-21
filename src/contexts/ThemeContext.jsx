import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const ThemeContext = createContext(null)
const STORAGE_KEY = 'wealthos_theme'

const getSystemPrefersDark = () =>
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

const applyThemeClass = (resolvedTheme) => {
  const root = document.documentElement
  if (resolvedTheme === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')
}

export const ThemeProvider = ({ children }) => {
  // theme = the user's raw choice: 'light' | 'dark' | 'system'
  const [theme, setThemeState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'system'
    } catch {
      return 'system'
    }
  })

  // resolvedTheme = what's actually applied right now ('light' | 'dark')
  const [resolvedTheme, setResolvedTheme] = useState(() =>
    theme === 'system' ? (getSystemPrefersDark() ? 'dark' : 'light') : theme
  )

  // Apply + persist whenever the raw choice changes
  useEffect(() => {
    const resolved = theme === 'system' ? (getSystemPrefersDark() ? 'dark' : 'light') : theme
    setResolvedTheme(resolved)
    applyThemeClass(resolved)
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // localStorage unavailable (private mode etc) — theme just won't persist
    }
  }, [theme])

  // Live-update when the OS theme changes, but only while in "system" mode
  useEffect(() => {
    if (theme !== 'system' || !window.matchMedia) return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => {
      const resolved = e.matches ? 'dark' : 'light'
      setResolvedTheme(resolved)
      applyThemeClass(resolved)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  const setTheme = useCallback((next) => {
    if (['light', 'dark', 'system'].includes(next)) setThemeState(next)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}

import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'

const OPTIONS = [
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'dark', icon: Moon, label: 'Dark' },
  { value: 'system', icon: Monitor, label: 'System' },
]

const ThemeToggle = ({ className = '' }) => {
  const { theme, setTheme } = useTheme()

  return (
    <div className={`theme-toggle-track ${className}`} role="group" aria-label="Pilih tema">
      {OPTIONS.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          type="button"
          className={`theme-toggle-btn ${theme === value ? 'active' : ''}`}
          onClick={() => setTheme(value)}
          title={label}
          aria-pressed={theme === value}
        >
          <Icon size={14} />
        </button>
      ))}
    </div>
  )
}

export default ThemeToggle

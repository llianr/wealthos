/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0A0B0F',
          secondary: '#111318',
          tertiary: '#181C26',
          card: '#13151C',
        },
        brand: {
          violet: '#6C63FF',
          'violet-dark': '#4B44CC',
          'violet-light': '#8B84FF',
          gold: '#F5C518',
          teal: '#00D4B4',
          red: '#FF4D6D',
          orange: '#FF8C42',
        },
        glass: {
          DEFAULT: 'rgba(255,255,255,0.05)',
          hover: 'rgba(255,255,255,0.08)',
          border: 'rgba(255,255,255,0.08)',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#8B92A5',
          muted: '#4A5065',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-violet': 'linear-gradient(135deg, #6C63FF 0%, #4B44CC 100%)',
        'gradient-gold': 'linear-gradient(135deg, #F5C518 0%, #E8A000 100%)',
        'gradient-teal': 'linear-gradient(135deg, #00D4B4 0%, #00A890 100%)',
        'gradient-red': 'linear-gradient(135deg, #FF4D6D 0%, #CC2244 100%)',
        'gradient-wealth': 'linear-gradient(135deg, #6C63FF 0%, #00D4B4 50%, #F5C518 100%)',
        'mesh-bg': 'radial-gradient(at 40% 20%, rgba(108,99,255,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(0,212,180,0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(245,197,24,0.05) 0px, transparent 50%)',
      },
      boxShadow: {
        'glow-violet': '0 0 30px rgba(108,99,255,0.3)',
        'glow-gold': '0 0 30px rgba(245,197,24,0.3)',
        'glow-teal': '0 0 30px rgba(0,212,180,0.3)',
        'glow-red': '0 0 30px rgba(255,77,109,0.3)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.6)',
        'glass': 'inset 0 1px 0 rgba(255,255,255,0.1)',
      },
      backdropBlur: {
        xs: '2px',
        '4xl': '72px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
        'wealth-pulse': 'wealthPulse 2s ease-in-out infinite',
        'gradient-shift': 'gradientShift 4s ease infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'number-count': 'numberCount 1s ease-out',
        'border-glow': 'borderGlow 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        wealthPulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.02)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        numberCount: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        borderGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(108,99,255,0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(108,99,255,0.6), 0 0 60px rgba(108,99,255,0.2)' },
        },
      },
    },
  },
  plugins: [],
}

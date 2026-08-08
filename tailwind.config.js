/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Casino dark backgrounds
        casino: {
          950: '#06060e',
          900: '#0a0a18',
          800: '#0f0f22',
          700: '#161628',
        },
        // Gold accents (medieval / luxury)
        gold: {
          300: '#f5d97a',
          400: '#e8c44a',
          500: '#c8a84b',
          600: '#a8882a',
          700: '#7a6020',
          800: '#4a3a10',
          900: '#2a2008',
        },
      },
      fontFamily: {
        cinzel: ['Cinzel', 'Georgia', 'serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(200, 168, 75, 0.4)',
        'gold-glow-lg': '0 0 40px rgba(200, 168, 75, 0.5)',
        'inner-dark': 'inset 0 2px 10px rgba(0, 0, 0, 0.8)',
      },
      animation: {
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
      },
      keyframes: {
        pulseGold: {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 1 },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
    },
  },
  plugins: [],
};

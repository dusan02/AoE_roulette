import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        medieval: {
          gold: '#D4AF37',
          goldDark: '#B8960C',
          brown: '#8B4513',
          brownDark: '#5D2E0C',
          cream: '#F5E6C8',
          red: '#8B0000',
          blue: '#1E3A5F',
        },
        aoe: {
          bg:        '#0b1520',
          bgMid:     '#0f1d2e',
          bgLight:   '#142336',
          panel:     '#172840',
          card:      '#1c3050',
          border:    '#2a4a6e',
          accent:    '#4a9fd5',
          accentDim: '#2d6a96',
          gold:      '#D4AF37',
          goldDim:   '#8a6e1a',
          text:      '#c8dff0',
          textDim:   '#7a9bbf',
        },
      },
      fontFamily: {
        medieval: ['Georgia', 'serif'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      opacity: {
        8: '0.08',
        12: '0.12',
        15: '0.15',
      },
      colors: {
        ink: {
          950: '#070B14',
          900: '#0B1120',
          850: '#0F1626',
          800: '#131C30',
          700: '#1B2740',
          600: '#27344F',
          500: '#3A4A6B',
          400: '#5B6B8F',
        },
        accent: {
          teal: '#2DD4BF',
          blue: '#3B82F6',
          glow: '#38BDF8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 30px -12px rgba(0,0,0,0.6)',
        glow: '0 0 0 1px rgba(45,212,191,0.25), 0 8px 40px -8px rgba(45,212,191,0.25)',
      },
      backgroundImage: {
        'radial-faint':
          'radial-gradient(600px circle at 50% 0%, rgba(45,212,191,0.06), transparent 60%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        'fade-in': 'fade-in 0.4s ease-out both',
      },
    },
  },
  plugins: [],
};

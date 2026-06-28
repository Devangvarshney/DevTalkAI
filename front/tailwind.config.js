/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'brand-deep': '#020203',
        'brand-base': '#050506',
        'brand-elevated': '#0a0a0c',
        'brand-accent': '#5E6AD2',
        'brand-accentBright': '#6872D9',
        'brand-foreground': '#EDEDEF',
        'brand-muted': '#8A8F98',
      },
      fontFamily: {
        sans: ["Inter", "Geist Sans", "system-ui", "sans-serif"],
      },
      animation: {
        'float-slow': 'float 10s ease-in-out infinite',
        'fadeIn': 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'soundwave': 'soundwave 1.2s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(1deg)' },
        },
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(12px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        soundwave: {
          '0%, 100%': { transform: 'scaleY(0.45)' },
          '50%': { transform: 'scaleY(1.3)' },
        }
      }
    },
  },
  plugins: [],
}
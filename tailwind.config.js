/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        champagne: {
          50: '#FDFCF9',
          100: '#F9F5EE',
          200: '#F3ECE0',
          300: '#E8DCCB',
          400: '#DCC7AF',
          500: '#C8AE90',
          600: '#A98E70',
          700: '#8A7053',
          800: '#69533B',
          900: '#483726',
        },
        ivory: {
          light: '#FFFDF9',
          DEFAULT: '#FAF7F2',
          dark: '#F3ECE1',
        },
        rosegold: {
          50: '#FBF5F4',
          100: '#F6E5E3',
          200: '#EDC9C5',
          300: '#DF9C94',
          400: '#CF776D',
          500: '#B76E79',
          600: '#9C5560',
          700: '#7E3E48',
          800: '#5F2D35',
        },
        gold: {
          light: '#F5E4B7',
          DEFAULT: '#D4AF37',
          deep: '#B8860B',
          dark: '#8C6514',
          shimmer: '#EAC775',
        },
        espresso: {
          900: '#1A110D',
          800: '#231713',
          700: '#2D1E18',
          600: '#3D2B24',
          500: '#5C4438',
          400: '#7C6053',
          300: '#A08274',
          200: '#C7B1A5',
          100: '#EBE1DC',
        },
        blush: {
          50: '#FFF8F7',
          100: '#FDF2F0',
          200: '#F9E3DF',
          300: '#F3CAC4',
          400: '#E4A59C',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Cormorant Garamond', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Poppins', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 10px 40px -10px rgba(35, 23, 19, 0.08)',
        'luxury-lg': '0 20px 60px -15px rgba(35, 23, 19, 0.14)',
        'gold-glow': '0 0 35px rgba(212, 175, 55, 0.3)',
        'gold-glow-lg': '0 0 60px rgba(212, 175, 55, 0.45)',
        'inner-gold': 'inset 0 0 20px rgba(212, 175, 55, 0.2)',
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, #FAF7F2 0%, #F3ECE0 50%, #E8DCCB 100%)',
        'gold-gradient': 'linear-gradient(135deg, #F5E4B7 0%, #D4AF37 50%, #B8860B 100%)',
        'rosegold-gradient': 'linear-gradient(135deg, #F6E5E3 0%, #B76E79 50%, #9C5560 100%)',
        'dark-luxury': 'linear-gradient(180deg, #231713 0%, #1A110D 100%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 3s ease-in-out infinite',
        pulseGlow: 'pulseGlow 4s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}


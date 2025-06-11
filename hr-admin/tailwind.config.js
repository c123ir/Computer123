/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'vazir': ['Vazirmatn', 'sans-serif'],
        'sans': ['Vazirmatn', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        }
      },
      backgroundColor: {
        'glass-light': 'rgba(255, 255, 255, 0.1)',
        'glass-dark': 'rgba(0, 0, 0, 0.1)',
        'glass-white': 'rgba(255, 255, 255, 0.8)',
        'glass-black': 'rgba(0, 0, 0, 0.8)',
      },
      backdropBlur: {
        xs: '2px',
        '3xl': '64px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-inset': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.06)',
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.04)',
        'hard': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      fontSize: {
        '2xs': '0.625rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
        '7xl': '4.5rem',
        '8xl': '6rem',
        '9xl': '8rem',
      },
      lineHeight: {
        '3': '.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '7': '1.75rem',
        '8': '2rem',
        '9': '2.25rem',
        '10': '2.5rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
        '14': 'repeat(14, minmax(0, 1fr))',
        '15': 'repeat(15, minmax(0, 1fr))',
        '16': 'repeat(16, minmax(0, 1fr))',
      },
      screens: {
        '3xl': '1600px',
        '4xl': '1920px',
      },
      transitionProperty: {
        'width': 'width',
        'spacing': 'margin, padding',
      },
      transitionDuration: {
        '0': '0ms',
        '2000': '2000ms',
        '3000': '3000ms',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'ease-in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
        'ease-out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    require('@tailwindcss/typography'),
    function({ addUtilities, addComponents, theme }) {
      const newUtilities = {
        '.text-shadow': {
          textShadow: '0 2px 4px rgba(0,0,0,0.10)',
        },
        '.text-shadow-md': {
          textShadow: '0 4px 8px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)',
        },
        '.text-shadow-lg': {
          textShadow: '0 15px 35px rgba(0,0,0,0.1), 0 5px 15px rgba(0,0,0,0.07)',
        },
        '.text-shadow-none': {
          textShadow: 'none',
        },
        '.scrollbar-thin': {
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgb(31 41 55) transparent',
        },
        '.scrollbar-webkit': {
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgb(156 163 175)',
            borderRadius: '20px',
            border: '1px solid transparent',
          },
        },
        '.glass-morphism': {
          background: 'rgba(255, 255, 255, 0.25)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          backdropFilter: 'blur(4px)',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.18)',
        },
        '.glass-morphism-dark': {
          background: 'rgba(0, 0, 0, 0.25)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          backdropFilter: 'blur(4px)',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.18)',
        },
      }

      const newComponents = {
        '.btn': {
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
          borderRadius: theme('borderRadius.md'),
          fontWeight: theme('fontWeight.medium'),
          fontSize: theme('fontSize.sm'),
          lineHeight: theme('lineHeight.5'),
          transition: 'all 0.2s ease-in-out',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          outline: 'none',
          '&:focus': {
            boxShadow: `0 0 0 2px ${theme('colors.blue.500')}`,
          },
          '&:disabled': {
            opacity: '0.6',
            cursor: 'not-allowed',
          },
        },
        '.btn-primary': {
          backgroundColor: theme('colors.blue.600'),
          color: theme('colors.white'),
          '&:hover': {
            backgroundColor: theme('colors.blue.700'),
            transform: 'translateY(-1px)',
            boxShadow: theme('boxShadow.lg'),
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        '.btn-secondary': {
          backgroundColor: theme('colors.gray.200'),
          color: theme('colors.gray.900'),
          '&:hover': {
            backgroundColor: theme('colors.gray.300'),
          },
          '.dark &': {
            backgroundColor: theme('colors.gray.700'),
            color: theme('colors.white'),
            '&:hover': {
              backgroundColor: theme('colors.gray.600'),
            },
          },
        },
        '.btn-ghost': {
          backgroundColor: 'transparent',
          color: theme('colors.gray.700'),
          '&:hover': {
            backgroundColor: theme('colors.gray.100'),
          },
          '.dark &': {
            color: theme('colors.gray.300'),
            '&:hover': {
              backgroundColor: theme('colors.gray.800'),
            },
          },
        },
        '.card': {
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: theme('borderRadius.xl'),
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: theme('spacing.6'),
          boxShadow: theme('boxShadow.lg'),
          transition: 'all 0.3s ease-in-out',
          '.dark &': {
            backgroundColor: 'rgba(31, 41, 55, 0.8)',
            border: '1px solid rgba(75, 85, 99, 0.3)',
          },
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme('boxShadow.xl'),
          },
        },
        '.input': {
          width: '100%',
          padding: `${theme('spacing.3')} ${theme('spacing.4')}`,
          borderRadius: theme('borderRadius.lg'),
          border: `1px solid ${theme('colors.gray.300')}`,
          backgroundColor: theme('colors.white'),
          fontSize: theme('fontSize.sm'),
          lineHeight: theme('lineHeight.5'),
          transition: 'all 0.2s ease-in-out',
          '&:focus': {
            outline: 'none',
            borderColor: theme('colors.blue.500'),
            boxShadow: `0 0 0 1px ${theme('colors.blue.500')}`,
          },
          '.dark &': {
            backgroundColor: theme('colors.gray.800'),
            borderColor: theme('colors.gray.600'),
            color: theme('colors.white'),
            '&::placeholder': {
              color: theme('colors.gray.400'),
            },
            '&:focus': {
              borderColor: theme('colors.blue.400'),
              boxShadow: `0 0 0 1px ${theme('colors.blue.400')}`,
            },
          },
        },
        '.badge': {
          display: 'inline-flex',
          alignItems: 'center',
          padding: `${theme('spacing.1')} ${theme('spacing.2')}`,
          fontSize: theme('fontSize.xs'),
          fontWeight: theme('fontWeight.medium'),
          borderRadius: theme('borderRadius.full'),
          textTransform: 'uppercase',
          letterSpacing: theme('letterSpacing.wide'),
        },
        '.badge-primary': {
          backgroundColor: theme('colors.blue.100'),
          color: theme('colors.blue.800'),
          '.dark &': {
            backgroundColor: theme('colors.blue.900'),
            color: theme('colors.blue.200'),
          },
        },
        '.badge-success': {
          backgroundColor: theme('colors.green.100'),
          color: theme('colors.green.800'),
          '.dark &': {
            backgroundColor: theme('colors.green.900'),
            color: theme('colors.green.200'),
          },
        },
        '.badge-warning': {
          backgroundColor: theme('colors.yellow.100'),
          color: theme('colors.yellow.800'),
          '.dark &': {
            backgroundColor: theme('colors.yellow.900'),
            color: theme('colors.yellow.200'),
          },
        },
        '.badge-error': {
          backgroundColor: theme('colors.red.100'),
          color: theme('colors.red.800'),
          '.dark &': {
            backgroundColor: theme('colors.red.900'),
            color: theme('colors.red.200'),
          },
        },
      }

      addUtilities(newUtilities)
      addComponents(newComponents)
    },
  ],
}
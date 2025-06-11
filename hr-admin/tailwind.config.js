/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // فعال کردن Dark Mode با class
  theme: {
    extend: {
      fontFamily: {
        'vazir': ['Vazirmatn', 'sans-serif'],
      },
      // رنگ‌های سفارشی برای Glassmorphism
      colors: {
        glass: {
          light: 'rgba(255, 255, 255, 0.25)',
          dark: 'rgba(0, 0, 0, 0.25)',
        }
      },
      // پس‌زمینه‌های شیشه‌ای
      backgroundColor: {
        'glass-light': 'rgba(255, 255, 255, 0.1)',
        'glass-dark': 'rgba(0, 0, 0, 0.1)',
        'glass-white': 'rgba(255, 255, 255, 0.2)',
        'glass-black': 'rgba(0, 0, 0, 0.2)',
      },
      // سایه‌های شیشه‌ای
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      // فیلترهای blur
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '40px',
      }
    },
  },
  plugins: [],
}
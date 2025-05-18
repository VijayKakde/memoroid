/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#4F46E5', // Indigo 600
          700: '#4338ca',
          800: '#312e81',
          900: '#1e1b4b',
        },
        success: {
          500: '#10B981', // Emerald 500
          600: '#059669',
        },
        warning: {
          500: '#F59E0B', // Amber 500
          600: '#D97706',
        },
        danger: {
          500: '#EF4444', // Red 500
          600: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
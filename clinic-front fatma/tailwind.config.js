/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Cairo', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50:  '#eff8ff',
          100: '#dbeefe',
          200: '#bfe3fd',
          300: '#93d1fb',
          400: '#60b5f7',
          500: '#3b96f2',
          600: '#1e75e7',
          700: '#1560d4',
          800: '#174dab',
          900: '#193f86',
          950: '#142852',
        },
      },
      boxShadow: {
        card:  '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 4px 16px 0 rgb(0 0 0 / 0.04)',
        modal: '0 20px 60px -10px rgb(0 0 0 / 0.25)',
      },
    },
  },
  plugins: [],
}

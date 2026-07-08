/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gov: {
          950: '#000A2E',
          900: '#001040',
          850: '#001550',
          800: '#001A4E',
          750: '#001D5A',
          700: '#002060',
          650: '#002878',
          600: '#003285',
          550: '#003D9E',
          500: '#0052CC',
          450: '#005CE6',
          400: '#0066FF',
          350: '#1A7AFF',
          300: '#3D8AFF',
          200: '#80B3FF',
          100: '#CCE0FF',
          50: '#EEF4FF',
        },
        success: { DEFAULT: '#10B981', light: '#D1FAE5' },
        warning: { DEFAULT: '#F59E0B', light: '#FEF3C7' },
        danger: { DEFAULT: '#EF4444', light: '#FEE2E2' },
        info: { DEFAULT: '#3B82F6', light: '#DBEAFE' },
      },
      fontFamily: {
        sans: ['"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

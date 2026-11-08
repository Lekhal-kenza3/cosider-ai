/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        ink: { 900: '#14202b', 700: '#2b3a48', 500: '#5b6b7a', 300: '#c5cdd5', 100: '#eef1f4', 50: '#f7f8fa' },
        brand: { 600: '#b4521c', 500: '#cf6a2e', 100: '#fbe9dd' },
      },
      fontFamily: { sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        christmas: {
          red: '#8B0000', // Deep red
          'light-red': '#D42426',
          green: '#2F5233',
          'light-green': '#4A7C59',
          gold: '#F1D570',
          cream: '#F8F5E6',
          snow: '#FFFFFF',
          dark: '#1a1a1a'
        }
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
        sans: ['Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

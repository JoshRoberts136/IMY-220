/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./frontend/src/**/*.{js,jsx,ts,tsx}",
    "./frontend/public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'apex-orange': '#8b0000',
        'apex-red': '#ff3333',
        'apex-dark': '#111111',
        'apex-darker': '#000000',
        'apex-blue': '#8b0000',
        'apex-gray-highlight': '#1f1f1f',
        'apex-gray': '#2d3748',
        'apex-light-gray': '#2a2a2a',
      },
      fontFamily: {
        rajdhani: ['Rajdhani', 'sans-serif'],
        orbitron: ['Orbitron', 'monospace'],
      },
    },
  },
  plugins: [],
}

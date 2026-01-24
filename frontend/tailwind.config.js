/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#97d8c9",
        "background-light": "#fdfbfa",
        "background-dark": "#141e1b",
        "bro-blue": "#d1eff7",
        "girl-pink": "#ffd9e2",
        "nerd-purple": "#e2d9ff",
        "benefit-mint": "#e0f2f1",
        "benefit-yellow": "#fff9c4",
        "benefit-peach": "#ffe0b2",
      },
      fontFamily: {
        "display": ["Plus Jakarta Sans", "sans-serif"],
        "sans": ["Plus Jakarta Sans", "sans-serif"],
      },
      boxShadow: {
        'soft-blue': '0 20px 40px -15px rgba(209, 239, 247, 0.6)',
        'soft-pink': '0 20px 40px -15px rgba(255, 217, 226, 0.6)',
        'soft-purple': '0 20px 40px -15px rgba(226, 217, 255, 0.6)',
      }
    },
  },
  plugins: [],
}
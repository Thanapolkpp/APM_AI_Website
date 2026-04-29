/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",

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
        "toon-black": "#1a1a1a",
      },
      fontFamily: {
        "display": ["Plus Jakarta Sans", "sans-serif"],
        "sans": ["Plus Jakarta Sans", "sans-serif"],
        "cartoon": ["'Comic Sans MS'", "'Chalkboard SE'", "cursive"],
      },
      boxShadow: {
        'soft-blue': '0 20px 40px -15px rgba(209, 239, 247, 0.6)',
        'soft-pink': '0 20px 40px -15px rgba(255, 217, 226, 0.6)',
        'soft-purple': '0 20px 40px -15px rgba(226, 217, 255, 0.6)',
        'toon': '4px 4px 0px 0px #1a1a1a',
        'toon-lg': '8px 8px 0px 0px #1a1a1a',
        'toon-xl': '12px 12px 0px 0px #1a1a1a',
      },
      borderWidth: {
        '3': '3px',
      }
    },
  },
  plugins: [],
}
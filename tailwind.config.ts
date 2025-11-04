/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        wood: {
          50:  "#f5efe7",  // warm cream
          100: "#efe6db",
          200: "#e3d4c0",
          300: "#d2b89a",
          400: "#c39a72",
          500: "#a8754b",  // copper/wood mid
          600: "#915e39",
          700: "#7a4d31",
          800: "#5a3e2b",  // deep walnut
          900: "#2a1b12",  // near-black brown
        },
        brass: { 500: "#c19a54" },
        ink:   { 900: "#1f130a" }
      },
      boxShadow: { soft: "0 10px 30px rgba(31,19,10,0.10)" },
      fontFamily: {
        sans: ["Inter","ui-sans-serif","system-ui"],
        serif: ["Playfair Display","Georgia","serif"],
      }
    },
  },
  plugins: [],
};

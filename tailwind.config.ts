/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#f1f5fb",
          100: "#e2eaf7",
          200: "#c4d4ee",
          300: "#9fb8e3",
          400: "#7396d6",
          500: "#2b4a8f",   // primary navy
          600: "#244077",
          700: "#1d345f",
          800: "#152848",
          900: "#0e1b30",
        },
        teal: {
          500: "#2bb5a3"   // accent
        }
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        serif: ["Playfair Display", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.08)"
      },
      borderRadius: {
        xl2: "1rem"
      }
    },
  },
  plugins: [],
};

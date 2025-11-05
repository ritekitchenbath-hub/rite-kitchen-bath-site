import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#eef4ff",
          100: "#d7e3ff",
          200: "#b5caff",
          300: "#8eacff",
          400: "#6b90f7",
          500: "#2b4a8f", // navy (brand)
          600: "#243e77",
          700: "#1d335f",
          800: "#162846",
          900: "#101e33",
        },
        wood: {
          50:  "#f7f2ea",
          100: "#efe6db",
          200: "#e4d7c6",
          300: "#d7c3ab",
          400: "#c5a689",
          500: "#b18764",
          600: "#9a7356",
          700: "#7a4d31",
          800: "#5a3a23",
          900: "#2b2018",
        },
        ink: {
          900: "#1b1b1b",
        },
      },
      boxShadow: {
        soft: "0 8px 24px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.05)",
      },
      borderRadius: {
        "xl2": "1rem",
      },
      container: {
        center: true,
        padding: "1rem",
        screens: {
          lg: "1024px",
          xl: "1200px",
          "2xl": "1320px",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

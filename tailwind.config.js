/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./datenschutz.html", "./impressum.html"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dark: "#060606",
        surface: "#0a0a0a",
        surface2: "#0e0e0e",
        border: "#1a1a1a",
        muted: "#a0a0a0",
        accent: "#60A5FA",
        light: "#f5f5f5",
        brand: {
          white: "#FFFFFF",
          accent: "#60A5FA",
          dark: "#060606",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["'Archivo Black'", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

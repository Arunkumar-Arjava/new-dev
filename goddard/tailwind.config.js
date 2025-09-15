/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#002e4d", // Updated to match specification
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#002e4d", // Updated to match specification
          foreground: "#FFFFFF",
        },
        background: "#FFFFFF",   // White background
        foreground: "#111827",   // Dark gray text
        muted: {
          DEFAULT: "#E5E7EB",    // Light gray
          foreground: "#6B7280", // Gray-500
        },
      },
    },
  },
  plugins: [],
}
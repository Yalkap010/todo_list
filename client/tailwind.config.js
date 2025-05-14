/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: "#F8FFFE",
        orange: "#FF9900",
        blue: "#00A3FF",
        red: "#FF0000",
        grey: "#FCFCFC",
        black: "#000000",
        white: "#FFFFFF"
      },
      fontFamily: {
         inter: ["Inter", "sans-serif"]
      }
    },
  },
  plugins: [],
}

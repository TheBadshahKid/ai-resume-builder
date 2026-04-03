/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-rust': '#A4523D',
        'brand-zinc': '#18181A',
      }
    },
  },
  plugins: [],
}

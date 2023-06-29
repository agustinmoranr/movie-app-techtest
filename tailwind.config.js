/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        'text-primary': '#ffffff',
        'background': '#0d1316',
        'primary-button': '#3c5667',
        'secondary-button': '#080b0d',
        'accent': '#131e24',
      }
    },
  },
  plugins: [],
}


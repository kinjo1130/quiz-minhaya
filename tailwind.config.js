/** @type {import('tailwindcss').Config} */
module.exports = {
  // tailwindを適用したいファイル群を指定
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './app.vue'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#003EE5',
        gray: '#F1F1F4'
      }
    }
  },
  plugins: []
}

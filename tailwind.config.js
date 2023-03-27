/** @type {import('tailwindcss').Config} */
module.exports = {
  // tailwindを適用したいファイル群を指定
  content: [
    './app.vue', // <= ドキュメントからさらに追加
    './components/**/*.{vue,js}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}'
  ],
  theme: {
    extend: {}
  },
  plugins: []
}

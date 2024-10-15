/** @type {import('tailwindcss').Config} */


module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'media',
  theme: {
    extend: {
      boxShadow: {
        custom: "rgba(50, 50, 93, 0.25) 0px 6px 10px -2px, rgba(0, 0, 0, 0.3) 0px -2px 5px -2px",
      }
    },
  },
  plugins: [
    require('autoprefixer'),
  ],
}


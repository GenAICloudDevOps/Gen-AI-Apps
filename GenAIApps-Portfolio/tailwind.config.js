/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'blue': {
          900: '#1a365d',
        },
      },
    },
  },
  plugins: [],
  important: true, // This ensures Tailwind styles take precedence
}

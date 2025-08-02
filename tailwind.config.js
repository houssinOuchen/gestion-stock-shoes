/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
      './app/**/*.{ts,tsx,js,jsx}',
      './pages/**/*.{ts,tsx,js,jsx}',
      './components/**/*.{ts,tsx,js,jsx}',
      './src/**/*.{ts,tsx,js,jsx}', // Optional if you use /src
    ],
    theme: {
      extend: {},
    },
    plugins: [require('tailwindcss-animate')],
  };
  
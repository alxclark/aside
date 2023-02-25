/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
    colors: {
      gray: {
        200: '#bcc5ce',
        300: '#9aa0a6',
        400: '#4a4c50',
        500: '#292a2d',
      },
      black: 'black',
      white: 'white',
      code: {
        gray: '#bec6cf',
      },
      console: {
        object: {
          gray: '#9aa0a6',
          purple: '#9980ff',
          cyan: '#36d4c7',
          blue: '#5db0d7',
        },
      },
    },
    fontFamily: {
      sans: ['sans-serif'],
      menlo: ['Menlo'],
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
    colors: {
      gray: {
        100: 'rgb(189, 198, 207)',
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
      elevation: {
        1: 'rgb(41, 42, 45)',
        2: 'rgb(53, 54, 58)',
      },
      hairline: 'rgb(73, 76, 80)',
      checkbox: {
        accent: 'rgb(255, 165, 0)',
      },
      lightblue: 'rgb(138, 180, 248)',
      background: 'rgb(32, 33, 36)',
      text: {
        secondary: 'rgb(154, 160, 166)',
      },
      input: {
        active: '#106099',
      },
    },
    fontFamily: {
      sans: ['sans-serif'],
      menlo: ['Menlo'],
    },
  },
  plugins: [],
};

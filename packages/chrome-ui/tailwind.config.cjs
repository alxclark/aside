/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        table: 'inset 0px 0px 0px 1px #4a4c50',
      },
    },
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
      background: 'rgb(32, 33, 36)',
      text: {
        secondary: 'rgb(154, 160, 166)',
      },
      input: {
        active: '#106099',
      },
      icon: {
        default: '#9aa0a6',
        error: 'rgb(242, 139, 130)',
        toggled: 'rgb(138, 180, 248)',
        subdued: '#757575',
      },
      focus: '#1a73e8',
      grid: {
        hover: '#172436',
        selected: '#10639d',
        even: '#232323',
        odd: '#292929',
      },
    },
    fontFamily: {
      sans: ['sans-serif'],
      menlo: ['Menlo'],
      helvetica: ['Helvetica Neue'],
    },
  },
  plugins: [],
};

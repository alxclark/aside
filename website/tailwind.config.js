/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      dark: {
        surface: '#1c1c1c',
        border: '#2c2c2c',
        accentBorder: '#ab4f41',
        text: '#bbbbbb',
        mono: '#707070',
        separator: '#ffffff09',
        surface2: '#171717',
        surface3: '#000',
        foreground: '#fff',
      },
      surface: '#f8f9fa',
      // accent: '#E9B42D',
      // accent: '#fe5c43',
      accent: "#14d6b5",
      transparent: 'transparent'
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    function ({addVariant}) {
      addVariant('child', '& > *');
    },
  ],
};

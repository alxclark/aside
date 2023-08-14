/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: ['class'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
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
        // TODO: conflict with shadcn
        active: '#106099',
      },
      icon: {
        default: '#9aa0a6',
        error: '#E46962',
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
      // shadcn
      border: 'hsl(var(--border))',
      // input: 'hsl(var(--input))',
      ring: 'hsl(var(--ring))',
      // background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      primary: {
        DEFAULT: 'hsl(var(--primary))',
        foreground: 'hsl(var(--primary-foreground))',
      },
      secondary: {
        DEFAULT: 'hsl(var(--secondary))',
        foreground: 'hsl(var(--secondary-foreground))',
      },
      destructive: {
        DEFAULT: 'hsl(var(--destructive))',
        foreground: 'hsl(var(--destructive-foreground))',
      },
      muted: {
        DEFAULT: 'hsl(var(--muted))',
        foreground: 'hsl(var(--muted-foreground))',
      },
      accent: {
        DEFAULT: 'hsl(var(--accent))',
        foreground: 'hsl(var(--accent-foreground))',
      },
      popover: {
        DEFAULT: 'hsl(var(--popover))',
        foreground: 'hsl(var(--popover-foreground))',
      },
      card: {
        DEFAULT: 'hsl(var(--card))',
        foreground: 'hsl(var(--card-foreground))',
      },
    },
    fontFamily: {
      sans: ['sans-serif'],
      menlo: ['Menlo'],
      helvetica: ['Helvetica Neue'],
    },
    // shadcn
    borderRadius: {
      lg: `var(--radius)`,
      md: `calc(var(--radius) - 2px)`,
      sm: 'calc(var(--radius) - 4px)',
    },
    keyframes: {
      'accordion-down': {
        from: {height: 0},
        to: {height: 'var(--radix-accordion-content-height)'},
      },
      'accordion-up': {
        from: {height: 'var(--radix-accordion-content-height)'},
        to: {height: 0},
      },
    },
    animation: {
      'accordion-down': 'accordion-down 0.2s ease-out',
      'accordion-up': 'accordion-up 0.2s ease-out',
    },
  },
  plugins: [require('tailwindcss-animate')],
  safelist: ['p-px'],
};

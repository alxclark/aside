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
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      primary: {
        DEFAULT: 'hsl(var(--primary))',
        foreground: 'hsl(var(--primary-foreground))',
      },
      secondary: {
        DEFAULT: 'hsl(var(--secondary))',
        foreground: 'hsl(var(--secondary-foreground))',
      },
      border: 'hsl(var(--border))',
      ring: 'hsl(var(--ring))',
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
      console: {
        DEFAULT: 'hsl(var(--console))',
        number: 'hsl(var(--console-number))',
        boolean: 'hsl(var(--console-boolean))',
        key: 'hsl(var(--console-key))',
        preview: 'hsl(var(--console-preview))',
        string: 'hsl(var(--console-string))',
        array: 'hsl(var(--console-array))',
        punctuation: 'hsl(var(--console-punctuation))',
      },
      checkbox: {
        accent: 'hsl(var(--checkbox-accent))',
      },
      softcontext: {
        accent: 'hsl(var(--softcontext-accent))',
      },
      icon: {
        default: 'hsl(var(--icon-default))',
        error: 'hsl(var(--icon-error))',
        toggled: 'hsl(var(--icon-toggled))',
        subdued: 'hsl(var(--icon-subdued))',
      },
      grid: {
        head: 'hsl(var(--grid-head))',
        hover: 'hsl(var(--grid-hover))',
        selected: 'hsl(var(--grid-selected))',
        even: 'hsl(var(--grid-even))',
        odd: 'hsl(var(--grid-odd))',
      },
      popover: {
        DEFAULT: 'hsl(var(--popover))',
        foreground: 'hsl(var(--popover-foreground))',
      },
      tabs: {
        foreground: 'hsl(var(--tabs-foreground))',
        accent: 'hsl(var(--tabs-accent))',
      },
    },
    fontFamily: {
      sans: ['sans-serif'],
      menlo: ['Menlo'],
      helvetica: ['Helvetica Neue'],
    },
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
  safelist: [
    // width
    'w-40',
    'min-w-40',
    'max-w-40',
    // padding
    'p-px',
    'p-1',
    'p-2',
    'py-1',
    'px-0.5',
    'p-0.5',
    // margin
    'ml-1',
    // height
    'h-full',
    'max-h-full',
    // flex
    'flex',
    'flex-col',
    'shrink',
    'shrink-0',
    'grow',
    'items-center',
    'items-start',
    'justify-center',
    'justify-between',
    // gap
    'gap-1',
    'gap-2',
    // position
    'relative',
    'overflow-scroll',
    'overflow-hidden',
    'break-words',
    // border
    'border-l',
  ],
};

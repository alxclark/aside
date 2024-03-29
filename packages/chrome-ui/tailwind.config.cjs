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
        table:
          'inset 0px -1px 0px 0px hsl(var(--border)), inset 0px 1px 0px 0px hsl(var(--border))',
        picker:
          '0 0 0 1px rgb(255 255 255/20%), 0 2px 4px 2px rgb(0 0 0/20%), 0 2px 6px 2px rgb(0 0 0/10%)',
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
        yellow: 'hsl(var(--icon-yellow))',
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
        background: 'hsl(var(--tabs-background))',
        accent: {
          foreground: 'hsl(var(--tabs-accent-foreground))',
          border: 'hsl(var(--tabs-accent-border))',
        },
        hover: 'hsl(var(--tabs-hover))',
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
    'w-52',
    'min-w-40',
    'max-w-40',
    // padding
    'p-px',
    'p-1',
    'pl-1',
    'p-2',
    'py-1',
    'px-0.5',
    'p-0.5',
    'pl-0.5',
    // margin
    'ml-1',
    // height
    'h-full',
    'max-h-full',
    'min-h-full',
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
    'gap-1.5',
    'gap-2',
    // position
    'relative',
    'overflow-scroll',
    'overflow-hidden',
    'break-words',
    // border
    'border-l',
    'border-l-2',
    'invert',
    'invert-0',
    'brightness-0',
    'brightness-100',
  ],
};

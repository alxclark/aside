import React from 'react';
import {cva} from 'class-variance-authority';
import {ButtonProps} from '@aside/chrome-ui-remote';

import {cn, VariantsFromProps} from '../../utilities/style';

type Variants = VariantsFromProps<ButtonProps, 'variant' | 'size'>;

const buttonVariants = cva<Variants>(
  'inline-flex items-center justify-center ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'text-primary-foreground hover:text-accent-foreground',
      },
      size: {
        default: 'px-1',
        icon: 'w-6 h-6 mx-0.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant,
  size,
  children,
  onClick,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(buttonVariants({variant, size, className}))}
      onClick={() => onClick?.()}
    >
      {children}
    </button>
  );
}

export {Button, buttonVariants, type ButtonProps};

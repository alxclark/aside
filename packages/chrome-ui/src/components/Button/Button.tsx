import * as React from 'react';
import {Slot} from '@radix-ui/react-slot';
import {cva} from 'class-variance-authority';
import {ButtonProps} from '@aside/chrome-ui-remote';

import {cn, VariantsFromProps} from '../../utilities/style';

type Variants = VariantsFromProps<ButtonProps, 'variant' | 'size'>;

const buttonVariants = cva<Variants>(
  'inline-flex items-center justify-center ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'text-gray-300 hover:text-white relative',
      },
      size: {
        default: 'px-1',
        icon: 'w-[28px] h-[26px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({className, variant, size, asChild = false, ...props}, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(buttonVariants({variant, size, className}))}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';

export {Button, buttonVariants, type ButtonProps};

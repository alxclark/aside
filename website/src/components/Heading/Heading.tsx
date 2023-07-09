import React from 'react';
import classNames from 'classnames';

export interface Props {
  children: React.ReactNode;
  className?: string;
  level?: 1 | 2 | 3 | 4;
}

export function Heading({children, level = 4, className}: Props) {
  switch (level) {
    case 1: {
      return (
        <h1
          className={classNames(
            'text-4xl dark:text-foreground font-semibold',
            className,
          )}
        >
          {children}
        </h1>
      );
    }
    case 2: {
      return (
        <h2 className={classNames('dark:text-foreground text-2xl', className)}>
          {children}
        </h2>
      );
    }
    case 3: {
      return <h3>{children}</h3>;
    }
    case 4: {
      return (
        <h4
          className={classNames(
            'font-medium dark:text-dark-foreground',
            className,
          )}
        >
          {children}
        </h4>
      );
    }
  }
}

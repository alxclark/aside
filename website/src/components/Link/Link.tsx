import React from 'react';

export interface Props {
  children: React.ReactNode;
  external?: boolean;
  to: string;
}

export function Link({children, external, to}: Props) {
  if (external) {
    return (
      <a
        className="dark:text-dark-foreground border-b-2 border-accent"
        href={to}
      >
        {children}
      </a>
    );
  }
  return null;
}

import React from 'react';

export interface Props {
  children: React.ReactNode;
  to: string;
}

export function Link({children, to}: Props) {
  return (
    <a href={to} className="text-lightblue underline">
      {children}
    </a>
  );
}

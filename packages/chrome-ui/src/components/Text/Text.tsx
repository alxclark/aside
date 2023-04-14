import React from 'react';

export interface Props {
  children: React.ReactNode;
}

export function Text({children}: Props) {
  return <p className="text-text-secondary text-sm">{children}</p>;
}

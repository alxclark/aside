import React from 'react';

export interface Props {
  children: React.ReactNode;
}

export function PaneHeader({children}: Props) {
  return (
    <div className="w-full border-b border-hairline bg-elevation-1">
      {children}
    </div>
  );
}

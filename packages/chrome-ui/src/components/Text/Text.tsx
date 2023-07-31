import React, {CSSProperties} from 'react';

export interface Props {
  children: React.ReactNode;
  align?: CSSProperties['textAlign'];
}

export function Text({children, align}: Props) {
  return (
    <p className="text-text-secondary text-sm" style={{textAlign: align}}>
      {children}
    </p>
  );
}

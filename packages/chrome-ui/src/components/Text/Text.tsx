import React from 'react';
import {TextProps} from '@aside/chrome-ui-remote';

export type {TextProps};

export function Text({children, align}: TextProps) {
  return (
    <p className="text-primary-foreground" style={{textAlign: align}}>
      {children}
    </p>
  );
}

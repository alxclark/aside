import React from 'react';
import {LinkProps} from '@aside/chrome-ui-remote';

export type {LinkProps};

export function Link({children, to}: LinkProps) {
  return (
    <a href={to} className="text-lightblue underline">
      {children}
    </a>
  );
}

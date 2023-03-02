import React from 'react';

import {Curly, Start} from './icons';

export interface Props {
  source: IconSource;
  color?: string;
  height?: number;
  width?: number;
}

export type IconSource = 'start' | 'curly';

export function Icon({source, ...props}: Props) {
  switch (source) {
    case 'curly':
      return <Curly {...props} />;
    case 'start':
      return <Start {...props} />;
    default:
      return null;
  }
}

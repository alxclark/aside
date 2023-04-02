import React from 'react';

import {Curly, Start, Filter, Cancel, Cog} from './icons';

export interface Props {
  source: IconSource;
  color?: string;
  height?: number;
  width?: number;
}

export type IconSource = 'start' | 'curly' | 'filter' | 'cancel' | 'cog';

export function Icon({source, ...props}: Props) {
  switch (source) {
    case 'curly':
      return <Curly {...props} />;
    case 'start':
      return <Start {...props} />;
    case 'filter':
      return <Filter {...props} />;
    case 'cancel':
      return <Cancel {...props} />;
    case 'cog':
      return <Cog {...props} />;
    default:
      return null;
  }
}

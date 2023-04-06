import React from 'react';

import {
  Curly,
  Start,
  Filter,
  Cancel,
  Cog,
  VerticalEllipsis,
  Close,
  RecordOn,
  RecordOff,
  Search,
} from './icons';

export interface Props {
  source: IconSource;
  color?: string;
  height?: number;
  width?: number;
}

export type IconSource =
  | 'start'
  | 'curly'
  | 'filter'
  | 'cancel'
  | 'cog'
  | 'vertical-ellipsis'
  | 'close'
  | 'record-on'
  | 'record-off'
  | 'search';

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
    case 'vertical-ellipsis':
      return <VerticalEllipsis {...props} />;
    case 'close':
      return <Close {...props} />;
    case 'record-on':
      return <RecordOn {...props} />;
    case 'record-off':
      return <RecordOff {...props} />;
    case 'search':
      return <Search {...props} />;
    default:
      return null;
  }
}

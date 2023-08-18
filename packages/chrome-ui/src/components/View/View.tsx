import React from 'react';
import {ViewProps} from '@aside/chrome-ui-remote';

export type {ViewProps};

export function View({children, className}: ViewProps) {
  return <div className={className}>{children}</div>;
}

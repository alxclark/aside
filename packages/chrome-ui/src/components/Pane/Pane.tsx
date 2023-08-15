import React from 'react';
import {PaneProps} from '@aside/chrome-ui-remote';

export type {PaneProps};

export function Pane({children}: PaneProps) {
  return <div className="h-full flex flex-col">{children}</div>;
}

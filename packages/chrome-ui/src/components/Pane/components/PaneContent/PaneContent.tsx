import React from 'react';
import {PaneContentProps} from '@aside/chrome-ui-remote';

export function PaneContent({children}: PaneContentProps) {
  return <div className="grow max-h-full overflow-scroll">{children}</div>;
}

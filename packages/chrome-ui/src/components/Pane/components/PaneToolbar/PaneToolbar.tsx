import React from 'react';
import {
  PaneToolbarProps,
  PaneToolbarSectionProps,
  PaneToolbarItemProps,
} from '@aside/chrome-ui-remote';

import {Divider} from '../../../Divider';

export function PaneToolbar({children}: PaneToolbarProps) {
  return (
    <div className="w-full border-b border-border bg-primary">{children}</div>
  );
}

export function PaneToolbarSection({
  children,
  separatorBefore,
}: PaneToolbarSectionProps) {
  return (
    <div className="flex items-center">
      {separatorBefore && <Divider />}
      {children}
      {!separatorBefore && <Divider />}
    </div>
  );
}

export function PaneToolbarItem({children}: PaneToolbarItemProps) {
  return (
    <div className="h-[26px]">
      <div className="flex items-center h-full px-1">{children}</div>
    </div>
  );
}

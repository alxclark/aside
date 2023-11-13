import React from 'react';
import {
  PaneToolbarProps,
  PaneToolbarSectionProps,
  PaneToolbarItemProps,
} from '@aside/chrome-ui-remote';

import {Divider} from '../../../Divider';
import {cn} from '../../../../utilities/style';

export function PaneToolbar({children, separatorBefore}: PaneToolbarProps) {
  return (
    <div
      className={cn(
        'w-full border-border bg-primary',
        separatorBefore ? 'border-t' : 'border-b',
      )}
    >
      {children}
    </div>
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

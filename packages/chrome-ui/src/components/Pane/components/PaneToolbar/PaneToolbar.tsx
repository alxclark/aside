import React from 'react';
import {
  PaneToolbarProps,
  PaneToolbarSectionProps,
  PaneToolbarItemProps,
} from '@aside/chrome-ui-remote';

import {Divider} from '../../../Divider';
import {Flex} from '../../../Flex';

export function PaneToolbar({children}: PaneToolbarProps) {
  return (
    <div className="w-full border-b border-hairline bg-elevation-1">
      {children}
    </div>
  );
}

export function PaneToolbarSection({
  children,
  separatorBefore,
}: PaneToolbarSectionProps) {
  return (
    <Flex alignItems="center">
      {separatorBefore && <Divider />}
      {children}
      {!separatorBefore && <Divider />}
    </Flex>
  );
}

export function PaneToolbarItem({children}: PaneToolbarItemProps) {
  return (
    <div className="h-[26px]">
      <Flex alignItems="center" fullHeight>
        {children}
      </Flex>
    </div>
  );
}

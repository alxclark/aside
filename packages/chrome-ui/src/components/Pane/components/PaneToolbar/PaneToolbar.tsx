import React, {PropsWithChildren} from 'react';

import {Divider} from '../../../Divider';
import {Flex} from '../../../Flex';

export interface PaneToolbarProps extends PropsWithChildren {}

export function PaneToolbar({children}: PaneToolbarProps) {
  return (
    <div className="w-full border-b border-hairline bg-elevation-1">
      {children}
    </div>
  );
}

export interface PaneToolbarSectionProps extends PropsWithChildren {
  separatorBefore?: boolean;
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

import React from 'react';
import {PaneProps} from '@aside/chrome-ui-remote';

import {Flex} from '../Flex';

export type {PaneProps};

export function Pane({children}: PaneProps) {
  return (
    <Flex fullHeight direction="column">
      {children}
    </Flex>
  );
}

import React from 'react';
import {PaneContentProps} from '@aside/chrome-ui-remote';

import {View} from '../../../View';

export function PaneContent({children}: PaneContentProps) {
  return (
    <View flexGrow maxHeight="100%" overflow="scroll">
      {children}
    </View>
  );
}

import React from 'react';

import {View} from '../../../View';

export interface Props {
  children: React.ReactNode;
}

export function PaneContent({children}: Props) {
  return (
    <View flexGrow maxHeight="100%" overflow="scroll">
      {children}
    </View>
  );
}
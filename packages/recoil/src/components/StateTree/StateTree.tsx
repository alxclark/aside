import {Log} from '@aside/chrome-ui';
import React from 'react';

import {Snapshot} from '../../types';

export function StateTree({currentState}: {currentState?: Snapshot}) {
  if (!currentState) return null;
  return (
    <Log
      items={[
        {
          id: 'currentState',
          value: currentState.nodes,
          onPress: () => console.log('pressed'),
        },
      ]}
    />
  );
}

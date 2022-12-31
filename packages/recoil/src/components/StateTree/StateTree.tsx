import {Log} from '@companion/react';
import React from 'react';

import {Snapshot} from '../../types';

export function StateTree({currentState}: {currentState?: Snapshot}) {
  if (!currentState) return null;
  return (
    <Log
      items={[
        {value: currentState.nodes, onPress: () => console.log('pressed')},
      ]}
    />
  );
}

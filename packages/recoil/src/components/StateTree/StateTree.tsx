import React, {useMemo} from 'react';
import {Log} from '@aside/chrome-ui';

import {Snapshot} from '../../types';

export function StateTree({currentState}: {currentState?: Snapshot}) {
  const items = useMemo(() => {
    return [
      {
        id: 'currentState',
        value: currentState?.nodes,
        onPress: () => console.log('pressed'),
      },
    ];
  }, [currentState]);

  if (!currentState) return null;

  return <Log items={items} />;
}

import React, {useMemo} from 'react';
import {Log} from '@aside/chrome-ui';
import {useRecoilValue} from 'recoil';

import {currentStateAtom} from '../../foundation/Snapshots';

export function StateTree() {
  const currentState = useRecoilValue(currentStateAtom);

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

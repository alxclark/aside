import React, {useContext} from 'react';
import {Log} from '@aside/chrome-ui';

import {ReactObserverContext} from '../../contexts';

export interface Props {
  children?: React.ReactNode;
}

export function ReactState({children}: Props) {
  const observer = useContext(ReactObserverContext);

  if (!observer) return null;

  return (
    <>
      <Log
        items={[
          {
            id: 'react',
            value: observer.snapshot.nodes,
          },
        ]}
      />
      {children}
    </>
  );
}

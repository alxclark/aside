import React from 'react';
import {Log} from '@aside/chrome-ui';

import {useDataSource} from './hooks';

export interface Props {
  children?: React.ReactNode;
  type: string;
}

export function DataView({children, type}: Props) {
  const observer = useDataSource(type).observer;

  return (
    <>
      <Log
        items={[
          {
            id: type,
            value: observer.snapshot.nodes,
          },
        ]}
      />
      {children}
    </>
  );
}

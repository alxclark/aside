import React from 'react';
import {ConsoleMessage} from '@aside/chrome-ui-remote';

import {useDataStore} from '../hooks';

export interface DataViewProps {
  children?: React.ReactNode;
  type: string;
}

export function DataView({children, type}: DataViewProps) {
  const observer = useDataStore(type).observer;

  return (
    <>
      <ConsoleMessage value={observer.snapshot.nodes} />
      {children}
    </>
  );
}

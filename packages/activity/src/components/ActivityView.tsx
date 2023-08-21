import React from 'react';
import {ConsoleMessage} from '@aside/chrome-ui-remote';

import {useDataStore} from '../hooks';

export interface ActivityViewProps {
  children?: React.ReactNode;
  type: string;
}

export function ActivityView({children, type}: ActivityViewProps) {
  const monitor = useDataStore(type).monitor;

  return (
    <>
      <ConsoleMessage value={monitor.snapshot.nodes} />
      {children}
    </>
  );
}

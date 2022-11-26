import React from 'react';

import {Snapshot} from '../../types';

export function StateTree({currentState}: {currentState?: Snapshot}) {
  if (!currentState) return null;
  return <>{JSON.stringify(currentState.nodes)}</>;
}

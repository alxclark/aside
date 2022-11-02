import React from 'react';
import { Snapshot } from '../../types';

export function StateTree({currentState}: {currentState: Snapshot}) {
  return (
    <>{JSON.stringify(currentState.nodes)}</>
  )
}
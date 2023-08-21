import {useContext} from 'react';

import {ActivityStoreContextMap} from '../contexts';

export function useActivityStore(type: string) {
  const context = ActivityStoreContextMap.get(type);

  if (!context) {
    throw new Error(`No data store for type ${type}`);
  }

  return useContext(context);
}

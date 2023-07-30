import {useContext} from 'react';

import {DataStoresContextMap} from '../contexts';

export function useDataStore(type: string) {
  const context = DataStoresContextMap.get(type);

  if (!context) {
    throw new Error(`No data store for type ${type}`);
  }

  return useContext(context);
}

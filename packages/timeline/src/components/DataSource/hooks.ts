import {useContext} from 'react';

import {DataProviderContextMap} from './DataProvider';

export function useDataSource(type: string) {
  const context = DataProviderContextMap.get(type);

  if (!context) {
    throw new Error(`No data provider for type ${type}`);
  }

  return useContext(context);
}

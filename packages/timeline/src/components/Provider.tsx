import {PropsWithChildren, useMemo} from 'react';

import {DataStoreDescriptor} from '../types';

import {DataProvider} from './DataProvider';

export interface ProviderProps extends PropsWithChildren {
  stores: DataStoreDescriptor<any>[];
}

export function Provider({stores, children}: ProviderProps) {
  const dataStores = useMemo(() => {
    return stores.reduce((prev, current) => {
      return <DataProvider {...current}>{prev}</DataProvider>;
    }, children);
  }, [children, stores]);

  return dataStores;
}

import {PropsWithChildren, useMemo} from 'react';

import {ActivityStoreDescriptor} from '../types';

import {ActivityProvider} from './ActivityProvider';

export interface ProviderProps extends PropsWithChildren {
  stores: ActivityStoreDescriptor<any>[];
}

export function Provider({stores, children}: ProviderProps) {
  const dataStores = useMemo(() => {
    return stores.reduce((prev, current) => {
      return <ActivityProvider {...current}>{prev}</ActivityProvider>;
    }, children);
  }, [children, stores]);

  return dataStores;
}

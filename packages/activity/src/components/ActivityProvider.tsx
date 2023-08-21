import {PropsWithChildren, useMemo} from 'react';

import {ActivityStoreDescriptor} from '../types';

import {ActivityStoreProvider} from './ActivityStoreProvider';

export interface ActivityProviderProps extends PropsWithChildren {
  activity: ActivityStoreDescriptor<any>[];
}

export function ActivityProvider({activity, children}: ActivityProviderProps) {
  return useMemo(
    () =>
      activity.reduce(
        (prev, current) => (
          <ActivityStoreProvider {...current}>{prev}</ActivityStoreProvider>
        ),
        children,
      ),
    [children, activity],
  );
}

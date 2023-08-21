import {useContext} from 'react';

import {ActivityStoreContextMap} from '../contexts';
import {ActivityData} from '../types';

export function useActivity() {
  return [...ActivityStoreContextMap.entries()].reduce<ActivityData[]>(
    (allStores, [, storeContext]) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const activityStore = useContext(storeContext);

      return [...allStores, activityStore.data];
    },
    [],
  );
}

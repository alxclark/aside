import {useMemo} from 'react';

import {useActivity} from './use-activity';

export function useActivityStore(type: string) {
  const activity = useActivity();

  return useMemo(() => {
    const store = activity.stores.find((store) => store.data.type === type);

    if (!store) {
      throw new Error(
        `No activity store of type ${type} available in context.`,
      );
    }

    return store;
  }, [activity.stores, type]);
}

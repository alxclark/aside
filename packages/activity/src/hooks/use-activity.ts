import {useContext} from 'react';

import {ActivityStoreContext} from '../contexts';

export function useActivity() {
  const activity = useContext(ActivityStoreContext);

  if (!activity) {
    throw new Error(`No activity available in context`);
  }

  return activity;
}

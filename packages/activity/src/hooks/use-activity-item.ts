import {useContext} from 'react';

import {ActivityItemContext} from '../contexts';

export function useActivityItem(): string | undefined {
  const item = useContext(ActivityItemContext);

  return item;
}

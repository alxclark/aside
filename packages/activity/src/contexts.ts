import {createContext} from 'react';

import {ActivityStore} from './types';

export const ActivityItemContext = createContext<string | undefined>(undefined);

/**
 * Map containing one React context per data store type.
 */
export const ActivityStoreContextMap = new Map<
  string,
  React.Context<ActivityStore>
>();

import {createContext} from 'react';

import {DataStore} from './types';

export const TimelineItemContext = createContext<string | undefined>(undefined);

/**
 * Map containing one React context per data store type.
 */
export const DataStoresContextMap = new Map<string, React.Context<DataStore>>();

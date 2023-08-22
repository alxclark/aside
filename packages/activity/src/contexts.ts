import {createContext} from 'react';

import {ActivityStore} from './types';

export const ActivityItemContext = createContext<string | undefined>(undefined);

export const ActivityStoreContext = createContext<ActivityStore[]>([]);

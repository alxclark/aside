import {createContext} from 'react';

import {TimelineData} from './Timeline';
import {Observer} from './types';

export const ReactTimelineContext = createContext<TimelineData | undefined>(
  undefined,
);

export const ReactObserverContext = createContext<Observer | undefined>(
  undefined,
);

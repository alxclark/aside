import {createContext} from 'react';

import {Observer} from './types';

export const ReactStateContext = createContext<Observer | undefined>(undefined);

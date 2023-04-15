import {createContext} from 'react';

import {ExtensionApi} from './types';

export const ExtensionApiContext = createContext<ExtensionApi | undefined>(
  undefined,
);

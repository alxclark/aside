import {createContext} from 'react';
import {StatefullExtensionApi} from '@aside/core';

export const ExtensionApiContext = createContext<
  StatefullExtensionApi | undefined
>(undefined);

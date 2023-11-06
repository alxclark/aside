import {createContext} from 'react';
import {type StatefullExtensionApi} from '@aside/core';

export const ExtensionApiContext = createContext<
  StatefullExtensionApi | undefined
>(undefined);

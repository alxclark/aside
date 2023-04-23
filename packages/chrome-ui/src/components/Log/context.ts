import {createContext} from 'react';

import {RendererContextType} from './types';

export const RendererContext = createContext<RendererContextType | undefined>(
  undefined,
);

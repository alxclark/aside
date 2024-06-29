import {dirname, relative} from 'path';
import type {UserConfig} from 'vite';

import {isDev, resolve} from './utilities';

export const baseConfig: UserConfig = {
  root: resolve('source'),
  resolve: {
    alias: {
      '~/': `${resolve('src')}/`,
    },
  },
  define: {
    __DEV__: isDev,
  },
  plugins: [],
  optimizeDeps: {
    include: [],
    exclude: [],
  },
};

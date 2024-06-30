import type {UserConfig} from 'vite';
import AutoImport from 'unplugin-auto-import/vite';

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
  plugins: [
    AutoImport({
      imports: [
        {
          'webextension-polyfill': [['*', 'browser']],
        },
      ],
      dts: false,
    }),
  ],
  optimizeDeps: {
    include: [],
    exclude: [],
  },
};

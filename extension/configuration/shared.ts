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
  // This probably can be removed since not all scripts will leverage it?
  plugins: [
    {
      name: 'assets-rewrite',
      enforce: 'post',
      apply: 'build',
      transformIndexHtml(html, {path}) {
        return html.replace(
          /"\/assets\//g,
          `"${relative(dirname(path), '/assets')}/`,
        );
      },
    },
  ],
  optimizeDeps: {
    include: [],
    exclude: [],
  },
};

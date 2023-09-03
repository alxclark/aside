/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable id-length */
import {resolve} from 'path';

import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import AutoImport from 'unplugin-auto-import/vite';

export const r = (...args: string[]) => resolve(__dirname, ...args);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    AutoImport({
      imports: [
        {
          'webextension-polyfill': [['*', 'browser']],
        },
      ],
      dts: r('auto-imports.d.ts'),
    }),
  ],
  server: {
    port: 3000,
  },
  root: r('src'),
  resolve: {
    alias: {
      // Alias packages to the index.
      // Otherwise Vite defaults to resolve the entrypoints
      // defined in the package.json files.
      // This is a problem during development, since
      // we don't want to rely on assets from the build directory.
      '@aside/core': `${r('../../packages/core/src')}`,
      '@aside/web': `${r('../../packages/web/src')}`,
      '@aside/react': `${r('../../packages/react/src')}`,
      '@aside/chrome-ui-remote': `${r('../../packages/chrome-ui-remote/src')}`,
      '@aside/timeline': `${r('../../packages/timeline/src')}`,
      '@aside/activity': `${r('../../packages/activity/src')}`,
      '@aside/recoil': `${r('../../packages/recoil/src')}`,
    },
  },
});

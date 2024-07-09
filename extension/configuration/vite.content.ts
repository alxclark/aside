import {defineConfig} from 'vite';

import {baseConfig} from './shared';
import {isDev, resolve} from './utilities';

export default defineConfig({
  ...baseConfig,
  build: {
    watch: isDev ? {} : undefined,
    outDir: isDev ? resolve('.dev') : resolve('build'),
    cssCodeSplit: false,
    emptyOutDir: false,
    sourcemap: isDev ? 'inline' : false,
    lib: {
      entry: {
        'content-entry': resolve('source/features/content/entry.ts'),
      },
      name: 'background',
      formats: ['iife'],
    },
  },
  define: {
    'process.env': {},
  },
  plugins: [...baseConfig.plugins!],
});

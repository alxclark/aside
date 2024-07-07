import {defineConfig} from 'vite';

import {baseConfig} from './shared';
import {isDev, resolve} from './utilities';

// bundling the content script using Vite
export default defineConfig({
  ...baseConfig,
  build: {
    watch: isDev ? {} : undefined,
    outDir: resolve('build'),
    cssCodeSplit: false,
    emptyOutDir: true,
    sourcemap: isDev ? 'inline' : false,
    lib: {
      entry: {
        background: resolve('source/features/background/background.ts'),
        content: resolve('source/features/content/content.ts'),
        'content-entry': resolve('source/features/content/entry.ts'),
      },
      name: 'background',
      formats: ['es', 'umd'],
    },
  },
  server: {
    hmr: {
      host: 'localhost',
    },
  },
  define: {
    'process.env': {},
  },
  plugins: [...baseConfig.plugins!],
});

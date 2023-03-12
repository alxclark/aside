import {defineConfig} from 'vite';

import {sharedConfig} from './vite.config';
import {isDev, r} from './scripts/utils';

// bundling the content script using Vite
export default defineConfig({
  ...sharedConfig,
  build: {
    watch: isDev ? {} : undefined,
    outDir: r('extension/dist/background'),
    cssCodeSplit: false,
    emptyOutDir: false,
    sourcemap: isDev ? 'inline' : false,
    lib: {
      entry: r('src/pages/background/index.ts'),
      name: 'background',
      formats: ['iife'],
    },
    rollupOptions: {
      output: {
        entryFileNames: 'index.global.js',
        extend: true,
      },
    },
  },
  server: {
    hmr: {
      host: 'localhost',
    },
  },
  define: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'process.env': {},
  },
  plugins: [...sharedConfig.plugins!],
  optimizeDeps: {
    exclude: ['@vite/client', '@vite/env'],
  },
});

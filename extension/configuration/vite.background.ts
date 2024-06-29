import {defineConfig} from 'vite';

import {sharedConfig} from './vite.config';
import {isDev, r} from './scripts/utils';

// bundling the content script using Vite
export default defineConfig({
  ...sharedConfig,
  build: {
    watch: isDev ? {} : undefined,
    outDir: r('build/background'),
    cssCodeSplit: false,
    emptyOutDir: false,
    sourcemap: isDev ? 'inline' : false,
    lib: {
      entry: r('source/features/background/background.ts'),
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
    'process.env': {},
  },
  plugins: [...sharedConfig.plugins!],
  optimizeDeps: {
    exclude: ['@vite/client', '@vite/env'],
  },
});

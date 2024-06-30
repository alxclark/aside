import {defineConfig} from 'vite';

import {baseConfig} from './shared';
import {isDev, resolve} from './utilities';

throw new Error(isDev ? 'isDev' : 'isProd');

// bundling the content script using Vite
export default defineConfig({
  ...baseConfig,
  build: {
    watch: isDev ? {} : undefined,
    outDir: resolve('build/background'),
    cssCodeSplit: false,
    emptyOutDir: false,
    sourcemap: isDev ? 'inline' : false,
    lib: {
      entry: resolve('source/features/background/background.ts'),
      name: 'background',
      formats: ['iife'],
    },
    rollupOptions: {
      output: {
        entryFileNames: 'background.js',
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
  plugins: [...baseConfig.plugins!],
  optimizeDeps: {
    // exclude: ['@vite/client', '@vite/env'],
  },
});

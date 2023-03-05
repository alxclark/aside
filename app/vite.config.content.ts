import {defineConfig} from 'vite';

import {sharedConfig} from './vite.config';
import {isDev, r} from './scripts/utils';
import packageJson from './package.json';

// bundling the content script using Vite
export default defineConfig({
  ...sharedConfig,
  build: {
    watch: isDev ? {} : undefined,
    outDir: r('extension/dist/contentScripts'),
    cssCodeSplit: false,
    emptyOutDir: false,
    sourcemap: isDev ? 'inline' : false,
    lib: {
      entry: r('src/pages/contentScript/index.ts'),
      name: packageJson.name,
      formats: ['iife'],
    },
    rollupOptions: {
      output: {
        entryFileNames: 'index.global.js',
        extend: true,
      },
    },
  },
  define: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'process.env': {},
  },
  plugins: [...sharedConfig.plugins!],
});

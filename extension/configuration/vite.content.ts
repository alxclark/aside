import {defineConfig} from 'vite';

import {baseConfig} from './shared';
import {isDev, resolve} from './utilities';
import packageJson from '../package.json';

// bundling the content script using Vite
export default defineConfig({
  ...baseConfig,
  build: {
    watch: isDev ? {} : undefined,
    outDir: resolve('build/content'),
    cssCodeSplit: false,
    emptyOutDir: false,
    sourcemap: isDev ? 'inline' : false,
    lib: {
      entry: resolve('source/features/content/content.ts'),
      name: packageJson.name,
      formats: ['iife'],
    },
    rollupOptions: {
      output: {
        entryFileNames: 'content.js',
        extend: true,
      },
    },
  },
  define: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'process.env': {},
  },
  plugins: [...baseConfig.plugins!],
});

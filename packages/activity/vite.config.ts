/* eslint-disable @typescript-eslint/naming-convention */
import {resolve} from 'path';

import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// eslint-disable-next-line id-length
export const r = (...args: string[]) => resolve(__dirname, '..', ...args);

export default defineConfig({
  plugins: [react()],
  build: {
    emptyOutDir: false,
    outDir: 'build/js',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'activity',
      formats: ['es', 'umd'],
      fileName: (format) => `activity.${format}.js`,
    },
    rollupOptions: {
      external: ['react', '@aside/react', '@aside/chrome-ui'],
      output: {
        globals: {
          react: 'React',

          '@aside/react': 'AsideReact',

          '@aside/chrome-ui': 'AsideChromeUi',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@aside/react': `${r('./react/src')}`,
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [`${r('../config/testing/setup.ts')}`],
  },
} as any);

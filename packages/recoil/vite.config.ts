/* eslint-disable @typescript-eslint/naming-convention */
import {resolve} from 'path';

import {defineConfig} from 'vite';

import {r} from '../../app/scripts/utils';

export default defineConfig({
  build: {
    emptyOutDir: false,
    outDir: 'build/js',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'recoil',
      formats: ['es', 'umd'],
      fileName: (format) => `recoil.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'recoil', '@aside/react', '@aside/timeline'],
      output: {
        globals: {
          react: 'React',
          '@aside/react': 'AsideReact',
          '@aside/timeline': 'AsideTimeline',
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [`${r('./src/tests/setup.ts')}`],
  },
} as any);

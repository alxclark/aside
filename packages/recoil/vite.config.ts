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
      external: ['react', 'recoil', '@aside/react', '@aside/activity'],
      output: {
        globals: {
          react: 'React',
          recoil: 'Recoil',
          '@aside/react': 'AsideReact',
          '@aside/activity': 'AsideActivity',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@aside/react/testing': `${r(
        '../packages/activity/src/testing/mount.tsx',
      )}`,
      '@aside/react': `${r('../packages/react/src')}`,
      '@aside/chrome-ui-remote': `${r('../packages/chrome-ui-remote/src')}`,
      '@aside/activity': `${r('../packages/activity/src')}`,
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [`${r('../config/testing/setup.ts')}`],
  },
} as any);

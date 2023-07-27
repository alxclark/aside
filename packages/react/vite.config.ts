/* eslint-disable @typescript-eslint/naming-convention */
import {resolve} from 'path';

import {defineConfig} from 'vite';

export default defineConfig({
  build: {
    emptyOutDir: false,
    outDir: 'build/js',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'aside-react',
      formats: ['es', 'umd'],
      fileName: (format) => `aside-react.${format}.js`,
    },
    rollupOptions: {
      external: ['react', '@aside-web', '@aside/chrome-ui', '@aside/timeline'],
      output: {
        globals: {
          react: 'React',
          '@aside/react': 'AsideReact',
          '@aside/chrome-ui': 'AsideChromeUi',
          '@aside/timeline': 'AsideTimeline',
        },
      },
    },
  },
});

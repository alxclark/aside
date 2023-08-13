/* eslint-disable @typescript-eslint/naming-convention */
import {resolve} from 'path';

import {defineConfig} from 'vite';

export default defineConfig({
  build: {
    emptyOutDir: false,
    outDir: 'build/js',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'aside-chrome-ui-remote',
      formats: ['es', 'umd'],
      fileName: (format) => `aside-chrome-ui-remote.${format}.js`,
    },
    rollupOptions: {
      external: ['@remote-ui/react'],
      output: {
        globals: {
          '@remote-ui/react': 'AsideReact',
        },
      },
    },
  },
});

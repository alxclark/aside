import {resolve} from 'path';

import {defineConfig} from 'vite';

export default defineConfig({
  build: {
    emptyOutDir: false,
    outDir: 'build/js',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'extension',
      formats: ['es', 'umd'],
      fileName: (format) => `extension.${format}.js`,
    },
  },
});

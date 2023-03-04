import {resolve} from 'path';

import {defineConfig} from 'vite';

export default defineConfig({
  build: {
    emptyOutDir: false,
    outDir: 'build/remote/js',
    lib: {
      entry: resolve(__dirname, 'src/remote/index.ts'),
      name: 'chrome-ui',
      formats: ['es', 'umd'],
      fileName: (format) => `chrome-ui.${format}.js`,
    },
    rollupOptions: {
      external: ['react'],
      output: {
        globals: {
          react: 'React',
        },
      },
    },
  },
});

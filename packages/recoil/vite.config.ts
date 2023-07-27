import {resolve} from 'path';

import {defineConfig} from 'vite';

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
      external: ['react', 'recoil'],
      output: {
        globals: {
          react: 'React',
        },
      },
    },
  },
});

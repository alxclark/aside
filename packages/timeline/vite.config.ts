import {resolve} from 'path';

import {defineConfig} from 'vite';

export default defineConfig({
  build: {
    emptyOutDir: false,
    outDir: 'build/js',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'timeline',
      formats: ['es', 'umd'],
      fileName: (format) => `timeline.${format}.js`,
    },
    rollupOptions: {
      external: ['react', '@aside/react', '@aside/chrome-ui'],
      output: {
        globals: {
          react: 'React',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          '@aside/react': 'AsideReact',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          '@aside/chrome-ui': 'AsideChromeUi',
        },
      },
    },
  },
});

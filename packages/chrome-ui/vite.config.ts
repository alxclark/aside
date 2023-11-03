/* eslint-disable @typescript-eslint/naming-convention */
import {resolve} from 'path';

import {defineConfig} from 'vite';

export default defineConfig({
  build: {
    emptyOutDir: false,
    outDir: 'build/js',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'chrome-ui',
      formats: ['es', 'umd'],
      fileName: (format) => `chrome-ui.${format}.js`,
    },
    rollupOptions: {
      external: [
        'react',
        '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-slot',
        '@radix-ui/react-tabs',
        'class-variance-authority',
        'clsx',
        'tailwind-merge',
      ],
      output: {
        globals: {
          react: 'React',
          '@radix-ui/react-dropdown-menu': 'RadixUiReactDropdownMenu',
          '@radix-ui/react-slot': 'RadixUiReactSlot',
          '@radix-ui/react-tabs': 'RadixUiReactTabs',
          'class-variance-authority': 'ClassVarianceAuthority',
          clsx: 'Clsx',
          'tailwind-merge': 'TailwindMerge',
        },
      },
    },
  },
});

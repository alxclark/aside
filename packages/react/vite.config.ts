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
      external: [
        'react',
        '@aside/chrome-ui-remote',
        '@aside/timeline',
        '@aside/core',
        '@remote-ui/async-subscription',
        '@remote-ui/rpc',
        '@remote-ui/react',
      ],
      output: {
        globals: {
          react: 'React',
          '@aside/chrome-ui-remote': 'AsideChromeUiRemote',
          '@aside/timeline': 'AsideTimeline',
          '@aside/core': 'AsideCore',
          '@remote-ui/async-subscription': 'RemoteUiAsyncSubscription',
          '@remote-ui/rpc': 'RemoteUiRpc',
          '@remote-ui/react': 'RemoteUiReact',
        },
      },
    },
  },
});

import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

import {baseConfig} from './shared';
import {isDev, port, resolve} from './utilities';

export default defineConfig(({command, mode}) => {
  return {
    ...baseConfig,
    root: resolve('source/features/devtools'),
    base: command === 'serve' ? `http://localhost:${port}/` : '/devtools/',
    server: {
      port,
      hmr: {
        host: 'localhost',
      },
    },
    build: {
      outDir: resolve('build/devtools'),
      emptyOutDir: false,
      sourcemap: isDev ? 'inline' : false,
      // https://developer.chrome.com/docs/webstore/program_policies/#:~:text=Code%20Readability%20Requirements
      terserOptions: {
        mangle: false,
      },
      rollupOptions: {
        input: {
          devtools: resolve('source/features/devtools/devtools.html'),
          devtoolsPanel: resolve('source/features/devtools/panel.html'),
        },
        output: {
          entryFileNames: `[name].js`,
          chunkFileNames: `[name].js`,
          assetFileNames: `[name].[ext]`,
        },
      },
    },
    plugins: mode === 'test' ? [] : [...baseConfig.plugins!, react()],
  };
});

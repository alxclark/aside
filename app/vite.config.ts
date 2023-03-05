/* eslint-disable @typescript-eslint/naming-convention */
// eslint-disable-next-line @typescript-eslint/triple-slash-reference, spaced-comment
/// <reference types="vitest" />

import {dirname, relative} from 'path';

import type {UserConfig} from 'vite';
import {defineConfig} from 'vite';
import AutoImport from 'unplugin-auto-import/vite';
import WindiCSS from 'vite-plugin-windicss';
import react from '@vitejs/plugin-react';

import windiConfig from './windi.config';
import {isDev, port, r} from './scripts/utils';

export const sharedConfig: UserConfig = {
  root: r('src'),
  resolve: {
    alias: {
      '~/': `${r('src')}/`,
      // Alias packages to the index.
      // Otherwise Vite defaults to resolve the entrypoints
      // defined in the package.json files.
      // This is a problem during development, since
      // we don't want to rely on assets from the build directory.
      '@aside/extension': `${r('../packages/extension/src')}`,
      '@aside/web': `${r('../packages/web/src')}`,
      '@aside/react': `${r('../packages/react/src')}`,
      '@aside/core': `${r('../packages/core/src')}`,
      '@aside/chrome-ui/react': `${r('../packages/chrome-ui/src')}`,
    },
  },
  define: {
    __DEV__: isDev,
  },
  plugins: [
    AutoImport({
      imports: [
        {
          'webextension-polyfill': [['*', 'browser']],
        },
      ],
      dts: r('src/auto-imports.d.ts'),
    }),

    // rewrite assets to use relative path
    {
      name: 'assets-rewrite',
      enforce: 'post',
      apply: 'build',
      transformIndexHtml(html, {path}) {
        return html.replace(
          /"\/assets\//g,
          `"${relative(dirname(path), '/assets')}/`,
        );
      },
    },
  ],
  optimizeDeps: {
    include: ['webextension-polyfill', '@remote-ui/react/host', 'react'],
    exclude: ['@aside/chrome-ui'],
  },
};

export default defineConfig(({command}) => ({
  ...sharedConfig,
  base: command === 'serve' ? `http://localhost:${port}/` : '/dist/',
  server: {
    port,
    hmr: {
      host: 'localhost',
    },
  },
  build: {
    outDir: r('extension/dist'),
    emptyOutDir: false,
    sourcemap: isDev ? 'inline' : false,
    // https://developer.chrome.com/docs/webstore/program_policies/#:~:text=Code%20Readability%20Requirements
    terserOptions: {
      mangle: false,
    },
    rollupOptions: {
      input: {
        background: r('src/pages/background/index.html'),
        options: r('src/pages/options/index.html'),
        popup: r('src/pages/popup/index.html'),
      },
    },
  },
  plugins: [
    ...sharedConfig.plugins!,
    react({fastRefresh: false}),
    // https://github.com/antfu/vite-plugin-windicss
    WindiCSS({
      config: windiConfig,
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
  },
}));

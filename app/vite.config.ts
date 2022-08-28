/// <reference types="vitest" />

import { dirname, relative } from 'path'
import type { UserConfig } from 'vite'
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import WindiCSS from 'vite-plugin-windicss'
import react from '@vitejs/plugin-react'
import windiConfig from './windi.config'
import { isDev, port, r } from './scripts/utils'

export const sharedConfig: UserConfig = {
  root: r('src'),
  resolve: {
    alias: {
      '~/': `${r('src')}/`,
    },
  },
  define: {
    __DEV__: isDev,
  },
  plugins: [
    AutoImport({
      imports: [
        {
          'webextension-polyfill': [
            ['*', 'browser'],
          ],
        },
      ],
      dts: r('src/auto-imports.d.ts'),
    }),

    // rewrite assets to use relative path
    {
      name: 'assets-rewrite',
      enforce: 'post',
      apply: 'build',
      transformIndexHtml(html, { path }) {
        return html.replace(/"\/assets\//g, `"${relative(dirname(path), '/assets')}/`)
      },
    },
  ],
  optimizeDeps: {
    include: [
      'webextension-polyfill',
    ],
  },
}

export default defineConfig(({ command }) => ({
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
        background: r('src/background/index.html'),
        options: r('src/options/index.html'),
        popup: r('src/popup/index.html'),
      },
    },
  },
  plugins: [
    ...sharedConfig.plugins!,
    react({ fastRefresh: false }),
    // https://github.com/antfu/vite-plugin-windicss
    WindiCSS({
      config: windiConfig,
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
  },
}))

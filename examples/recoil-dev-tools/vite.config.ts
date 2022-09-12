import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import AutoImport from 'unplugin-auto-import/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), AutoImport({
    imports: [
      {
        'webextension-polyfill': [
          ['*', 'browser'],
        ],
      },
    ],
  }),],
  server: {
    port: 3000
  }
})

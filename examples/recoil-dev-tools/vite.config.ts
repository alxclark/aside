import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import AutoImport from 'unplugin-auto-import/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    AutoImport({
      imports: [
        {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'webextension-polyfill': [['*', 'browser']],
        },
      ],
    }),
  ],
  server: {
    port: 3000,
  },
});

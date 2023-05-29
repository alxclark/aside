/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable id-length */
import {resolve} from 'path';

import {defineConfig} from 'vitest/config';

export const r = (...args: string[]) => resolve(__dirname, '..', ...args);

export default defineConfig({
  test: {
    globals: true,
  },
  resolve: {
    alias: {
      '@aside/chrome-ui': `${r('../packages/chrome-ui/src/remote')}`,
    },
  },
});

import path, {resolve as pathResolve} from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

export const resolve = (...args: string[]) =>
  pathResolve(__dirname, '..', ...args);
export const isDev = process.env.NODE_ENV !== 'production';
export const port = parseInt(process.env.PORT || '', 10) || 8888;

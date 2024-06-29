import {resolve as pathResolve} from 'path';

export const resolve = (...args: string[]) =>
  pathResolve(__dirname, '..', ...args);
export const isDev = process.env.NODE_ENV !== 'production';
export const port = parseInt(process.env.PORT || '', 10) || 8888;

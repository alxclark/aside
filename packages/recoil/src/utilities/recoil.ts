export const KEY_PREFIX = '__companion';

export function createKey(key: string) {
  return `${KEY_PREFIX}__${key}`;
}

export function isInternalAtom(key: string): boolean {
  return key.startsWith(KEY_PREFIX);
}

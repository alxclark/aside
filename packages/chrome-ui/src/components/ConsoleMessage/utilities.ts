import {DiffNode} from './types';

export function isDiff(value: any): value is DiffNode {
  if (value?.__tag === 'diff') {
    return true;
  }
  return false;
}

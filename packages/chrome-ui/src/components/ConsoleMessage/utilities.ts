import {DiffNode} from '@aside/chrome-ui-remote';

export function isDiff(value: any): value is DiffNode {
  if (value?.__tag === 'diff') {
    return true;
  }
  return false;
}

import {isDiff} from '../../utilities';

export function isCollapsible(value: any): boolean {
  if (Array.isArray(value)) {
    return true;
  }

  if (typeof value === 'object') {
    if (isDiff(value)) {
      return isCollapsible(value.next);
    }

    if (value === null) {
      return false;
    }

    return true;
  }

  return false;
}

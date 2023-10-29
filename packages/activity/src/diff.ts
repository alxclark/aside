export interface DiffNode {
  __tag: 'diff';
  next: any;
  previous: any;
}

export interface DiffInput {
  previous: any;
  next: any;
}

export function createDiff(input: DiffInput): {[key: string]: any} {
  const {previous, next} = input;
  const diff: {[key: string]: any} = {};

  if (next === previous) return {};

  if (
    typeof next !== 'object' &&
    typeof previous !== 'object' &&
    next !== previous
  ) {
    return createDiffNode(next, previous);
  }

  for (const key in next) {
    if (!previous || !(key in previous)) {
      diff[key] = createDiffNode(next[key], undefined);
    } else if (isObject(next[key]) && isObject(previous[key])) {
      const nestedDiff = createDiff({previous: previous[key], next: next[key]});
      if (Object.keys(nestedDiff).length > 0) {
        diff[key] = nestedDiff;
      }
    } else if (Array.isArray(next[key]) && Array.isArray(previous[key])) {
      const arrayDiff = createArrayDiff({
        previous: previous[key],
        next: next[key],
      });
      if (Object.keys(arrayDiff).length > 0) {
        diff[key] = arrayDiff;
      }
    } else if (next[key] !== previous[key]) {
      diff[key] = createDiffNode(next[key], previous[key]);
    }
  }

  for (const key in previous) {
    if (!(key in next)) {
      diff[key] = createDiffNode(undefined, previous[key]);
    }
  }

  return diff;
}

function createDiffNode(next: any, previous: any): DiffNode {
  return {
    __tag: 'diff',
    next,
    previous,
  };
}

function isObject(value: any): boolean {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function createArrayDiff(input: DiffInput): {[key: string]: any} {
  const {previous, next} = input;
  const diff: {[key: string]: any} = {};

  const maxLength = Math.max(next.length, previous.length);
  for (let i = 0; i < maxLength; i++) {
    if (i >= next.length) {
      diff[i] = createDiffNode(undefined, previous[i]);
    } else if (i >= previous.length) {
      diff[i] = createDiffNode(next[i], undefined);
    } else if (Array.isArray(next[i]) && Array.isArray(previous[i])) {
      const nestedArrayDiff = createArrayDiff({
        previous: previous[i],
        next: next[i],
      });

      if (Object.keys(nestedArrayDiff).length > 0) {
        diff[i] = nestedArrayDiff;
      }
    } else {
      const itemDiff = createDiff({previous: previous[i], next: next[i]});

      if (Object.keys(itemDiff).length > 0) {
        diff[i] = itemDiff;
      }
    }
  }

  return diff;
}

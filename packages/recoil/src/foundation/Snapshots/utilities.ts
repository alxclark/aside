import {Diff, DiffNodes, Snapshot} from './types';

export function createDiffFromSnapshots(
  previousSnapshot: Snapshot,
  currentSnapshot: Snapshot,
): Diff {
  const diff: Diff = {
    id: currentSnapshot.id,
    createdAt: currentSnapshot.createdAt,
    nodes: {},
    initial: currentSnapshot.initial,
  };

  function compareObjects(firstObject: any, secondObject: any, path = '') {
    for (const key in secondObject) {
      if (secondObject.hasOwnProperty(key)) {
        const newPath = (path ? `${path}.` : '') + key;
        if (secondObject.hasOwnProperty(key)) {
          if (
            typeof firstObject[key] === 'object' &&
            typeof secondObject[key] === 'object'
          ) {
            compareObjects(firstObject[key], secondObject[key], newPath);
          } else if (firstObject[key] !== secondObject[key]) {
            diff.nodes[newPath] = {
              __tag: 'diff',
              previous: firstObject[key],
              next: secondObject[key],
            };
          }
        } else {
          diff.nodes[newPath] = {
            __tag: 'diff',
            previous: firstObject[key],
            next: undefined,
          };
        }
      }
    }
  }

  compareObjects(previousSnapshot.nodes, currentSnapshot.nodes);

  // Check for keys in previousSnapshot.nodes that are not in currentSnapshot.nodes
  // TODO: This needs to check recursively
  function checkMissingKeys(firstObject: any, secondObject: any, path = '') {
    for (const key in secondObject) {
      if (
        !secondObject.hasOwnProperty(key) &&
        firstObject.hasOwnProperty(key)
      ) {
        const newPath = (path ? `${path}.` : '') + key;
        diff.nodes[newPath] = {
          __tag: 'diff',
          previous: firstObject[key],
          next: undefined,
        };
      }
    }
  }

  checkMissingKeys(previousSnapshot.nodes, currentSnapshot.nodes);

  return diff;
}

export function createDiff0({
  next,
  previous,
}: {
  next: object;
  previous: object;
}): DiffNodes {
  const nodes: DiffNodes = {};

  function compareObjects(firstObject: any, secondObject: any, path = '') {
    for (const key in secondObject) {
      if (secondObject.hasOwnProperty(key)) {
        const newPath = (path ? `${path}.` : '') + key;
        if (secondObject.hasOwnProperty(key)) {
          if (
            typeof firstObject[key] === 'object' &&
            typeof secondObject[key] === 'object'
          ) {
            compareObjects(firstObject[key], secondObject[key], newPath);
          } else if (firstObject[key] !== secondObject[key]) {
            nodes[newPath] = {
              __tag: 'diff',
              previous: firstObject[key],
              next: secondObject[key],
            };
          }
        } else {
          nodes[newPath] = {
            __tag: 'diff',
            previous: firstObject[key],
            next: undefined,
          };
        }
      }
    }
  }

  compareObjects(previous, next);

  // Check for keys in previousSnapshot.nodes that are not in currentSnapshot.nodes
  // TODO: This needs to check recursively
  function checkMissingKeys(firstObject: any, secondObject: any, path = '') {
    for (const key in secondObject) {
      if (
        !secondObject.hasOwnProperty(key) &&
        firstObject.hasOwnProperty(key)
      ) {
        const newPath = (path ? `${path}.` : '') + key;
        nodes[newPath] = {
          __tag: 'diff',
          previous: firstObject[key],
          next: undefined,
        };
      }
    }
  }

  checkMissingKeys(previous, next);

  return nodes;
}

interface DiffNode {
  __tag: 'diff';
  next: any;
  previous: any;
}

interface DiffInput {
  previous: any;
  next: any;
}

function createDiff(input: DiffInput): {[key: string]: any} {
  const {previous, next} = input;
  const diff: {[key: string]: any} = {};

  if (
    typeof next !== 'object' &&
    typeof previous !== 'object' &&
    next !== previous
  ) {
    return createDiffNode(next, previous);
  }

  for (const key in next) {
    if (!(key in previous)) {
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

export {createDiff};

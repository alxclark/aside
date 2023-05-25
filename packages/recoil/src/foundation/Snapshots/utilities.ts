import {Diff, Snapshot} from './types';

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

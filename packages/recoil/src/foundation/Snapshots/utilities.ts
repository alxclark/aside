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

  console.log({previousSnapshot, currentSnapshot, diff});

  function compareObjects(firstObject: any, secondObject: any, path = '') {
    for (const key in firstObject) {
      if (firstObject.hasOwnProperty(key)) {
        const newPath = (path ? `${path}.` : '') + key;

        if (secondObject.hasOwnProperty(key)) {
          if (
            typeof firstObject[key] === 'object' &&
            typeof secondObject[key] === 'object'
          ) {
            compareObjects(firstObject[key], secondObject[key], newPath);
          } else if (firstObject[key] !== secondObject[key]) {
            diff.nodes[newPath] = {
              previous: firstObject[key],
              next: secondObject[key],
            };
          }
        } else {
          diff.nodes[newPath] = {
            previous: firstObject[key],
            next: undefined,
          };
        }
      }
    }
  }

  compareObjects(previousSnapshot.nodes, currentSnapshot.nodes);

  // Check for keys in currentSnapshot.nodes that are not in previousSnapshot.nodes
  function checkMissingKeys(firstObject: any, secondObject: any, path = '') {
    for (const key in secondObject) {
      if (
        secondObject.hasOwnProperty(key) &&
        !firstObject.hasOwnProperty(key)
      ) {
        const newPath = (path ? `${path}.` : '') + key;
        diff.nodes[newPath] = {
          previous: undefined,
          next: secondObject[key],
        };
      }
    }
  }

  checkMissingKeys(previousSnapshot.nodes, currentSnapshot.nodes);

  return diff;
}

/* eslint-disable line-comment-position */
import {atom, selector, selectorFamily} from 'recoil';

import {createKey} from '../../utilities/recoil';
import {syncStorageEffect} from '../Extension';

import {Diff, DiffNodes, Snapshot} from './types';
import {createDiff} from './utilities';

export const filterAtom = atom<string>({
  key: createKey('filter'),
  default: '',
  effects: [syncStorageEffect()],
});

export const showFilterAtom = atom<boolean>({
  key: createKey('show-filter'),
  default: false,
  effects: [syncStorageEffect()],
});

export const invertFilterAtom = atom<boolean>({
  key: createKey('invert-filter'),
  default: false,
  effects: [syncStorageEffect()],
});

export const preserveLogAtom = atom<boolean>({
  key: createKey('preserve-log'),
  default: false,
  effects: [syncStorageEffect()],
});

export const recordSnapshotAtom = atom<boolean>({
  key: createKey('record-snapshot'),
  default: true,
  effects: [syncStorageEffect()],
});

export const snapshotsAtom = atom<Snapshot[]>({
  key: createKey('snapshots'),
  default: [],
  effects: [syncStorageEffect()],
});

/**
 * The latest Recoil state.
 *
 * Although we store a separate list of all snapshots,
 * this is not a selector since users can wipe the snapshot history
 * but we still need to preserve the current state.
 */
export const currentStateAtom = atom<Snapshot | undefined>({
  key: createKey('current-state'),
  default: undefined,
});

export const previousSnapshotAtom = atom<Snapshot | undefined>({
  key: createKey('previous-state'),
  default: undefined,
  effects: [syncStorageEffect()],
});

export const diffsAtom = selector<Diff[]>({
  key: createKey('diffs'),
  get: ({get}) => {
    const snapshots = get(snapshotsAtom);
    return snapshots.reduce<Diff[]>((prev, {id}) => {
      const diff = get(getDiffAtom(id));

      if (diff) {
        prev.push(diff);
      }

      return prev;
    }, []);
  },
});

export const getDiffAtom = selectorFamily<Diff | undefined, string>({
  key: createKey('get-diff'),
  get:
    (id) =>
    ({get}) => {
      const snapshots = get(snapshotsAtom);
      const snapshotIndex = snapshots.findIndex(
        (snapshot) => snapshot.id === id,
      );

      if (snapshotIndex === -1) {
        return;
      }

      const nextSnapshot = snapshots[snapshotIndex];
      if (snapshotIndex === 0) {
        const previousSnapshot = get(previousSnapshotAtom);
        if (!snapshots[snapshotIndex].initial && previousSnapshot) {
          return {
            id: nextSnapshot.id,
            createdAt: nextSnapshot.createdAt,
            initial: nextSnapshot.initial,
            nodes: createDiff({
              previous: previousSnapshot.nodes,
              next: nextSnapshot.nodes,
            }),
          };
        }

        return {
          id: nextSnapshot.id,
          createdAt: nextSnapshot.createdAt,
          initial: nextSnapshot.initial,
          nodes: createDiff({
            previous: {},
            next: nextSnapshot.nodes,
          }),
        };
      }

      if (nextSnapshot.initial) {
        return {
          id: nextSnapshot.id,
          createdAt: nextSnapshot.createdAt,
          initial: nextSnapshot.initial,
          nodes: createDiff({
            previous: {},
            next: nextSnapshot.nodes,
          }),
        };
      }

      return {
        id: nextSnapshot.id,
        createdAt: nextSnapshot.createdAt,
        initial: nextSnapshot.initial,
        nodes: createDiff({
          previous: snapshots[snapshotIndex - 1].nodes,
          next: nextSnapshot.nodes,
        }),
      };
    },
});

export const getDiffQueryAtom = selectorFamily<string, string>({
  key: createKey('diff-query'),
  get:
    (id) =>
    ({get}) => {
      const diff = get(getDiffAtom(id));

      if (!diff) return '';

      return traverseObject(diff.nodes) + (diff.initial ? 'initial' : '');
    },
});

export const getDiff2QueryAtom = selectorFamily<string, string>({
  key: createKey('diff-2-query'),
  get:
    (id) =>
    ({get}) => {
      const diff = get(diffsAtom).find((diff) => diff.id === id);

      if (!diff) return '';

      return traverseDiff(diff.nodes) + (diff.initial ? 'initial' : '');
    },
});

function traverseObject(obj: any) {
  let result = '';

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      result += `${key}:${
        typeof value === 'object' ? traverseObject(value) : value
      },`;
    }
  }

  result = result.slice(0, -1);

  return result;
}

function traverseDiff(obj: DiffNodes) {
  let result = '';

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key]?.next;
      result += `${key}:${
        typeof value === 'object' && value !== null
          ? // TODO: Support arrays
            traverseDiff(value as any)
          : value
      },`;
    }
  }

  result = result.slice(0, -1);

  return result;
}

export const filteredDiffsAtom = selector<Snapshot[]>({
  key: createKey('filtered-diffs-2'),
  get: ({get}) => {
    const diffs = get(diffsAtom);
    const filter = get(filterAtom);
    const invert = get(invertFilterAtom);

    return diffs.filter((diff) => {
      const query = get(getDiff2QueryAtom(diff.id));

      const included = query.includes(filter);

      return invert ? !included : included;
    });
  },
});

export const selectedDiffBaseAtom = atom<string | undefined>({
  key: createKey('selected-diff-base'),
  default: undefined,
  effects: [syncStorageEffect()],
});

export const selectedDiffAtom = selector<string | undefined>({
  key: createKey('selected-diff'),
  get: ({get}) => {
    const diffs = get(filteredDiffsAtom);
    const explicitlySelectedDiff = get(selectedDiffBaseAtom);

    if (diffs.find((diff) => diff.id === explicitlySelectedDiff))
      return explicitlySelectedDiff;

    return diffs[diffs.length - 1]?.id;
  },
  set: ({set}, value) => {
    set(selectedDiffBaseAtom, value);
  },
});

import {atom, selector, selectorFamily} from 'recoil';

import {createKey} from '../../utilities/recoil';
import {syncStorageEffect} from '../Extension';

import {Snapshot} from './types';

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

/**
 * The initial Recoil state.
 *
 * Although we store a separate list of all snapshots,
 * this is not a selector since users can wipe the snapshot history
 * and we don't want to just select the first snapshot in the history.
 */
export const initialStateAtom = atom<Snapshot | undefined>({
  key: createKey('initial-state'),
  default: undefined,
});

export const diffsAtom = atom<Snapshot[]>({
  key: createKey('diffs'),
  default: [],
  effects: [syncStorageEffect({reconciliation: 'mergeBefore'})],
});

export const getDiffQueryAtom = selectorFamily<string, string>({
  key: createKey('diff-query'),
  get:
    (id) =>
    ({get}) => {
      const diff = get(diffsAtom).find((diff) => diff.id === id);

      if (!diff) return '';

      return traverseObject(diff.nodes);
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

export const filteredDiffsAtom = selector<Snapshot[]>({
  key: createKey('filtered-diffs'),
  get: ({get}) => {
    const diffs = get(diffsAtom);
    const filter = get(filterAtom);

    return diffs.filter((diff) => {
      const query = get(getDiffQueryAtom(diff.id));

      return query.includes(filter);
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

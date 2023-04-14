import {atom, selector} from 'recoil';

import {createKey} from '../../utilities/recoil';

import {Snapshot} from './types';

export const filterAtom = atom<string>({
  key: createKey('filter'),
  default: '',
});

export const showFilterAtom = atom<boolean>({
  key: createKey('show-filter'),
  default: false,
});

export const preserveLogAtom = atom<boolean>({
  key: createKey('preserve-log'),
  default: false,
});

export const recordSnapshotAtom = atom<boolean>({
  key: createKey('record-snapshot'),
  default: true,
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
});

export const selectedDiffBaseAtom = atom<string | undefined>({
  key: createKey('selected-diff-base'),
  default: undefined,
});

export const selectedDiffAtom = selector<string | undefined>({
  key: createKey('selected-diff'),
  get: ({get}) => {
    const diffs = get(diffsAtom);
    const explicitlySelectedDiff = get(selectedDiffBaseAtom);

    if (explicitlySelectedDiff) return explicitlySelectedDiff;

    return diffs[diffs.length - 1]?.id;
  },
  set: ({set}, value) => {
    set(selectedDiffBaseAtom, value);
  },
});

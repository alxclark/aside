import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import {TimelineData} from '@aside/timeline';
import {useCallback, useMemo} from 'react';

import {
  diffsAtom,
  previousSnapshotAtom,
  snapshotsAtom,
} from '../foundation/Snapshots';
// eslint-disable-next-line @shopify/strict-component-boundaries
import {Diff} from '../foundation/Snapshots/types';

export interface RecoilData extends TimelineData<Diff> {
  type: 'recoil';
}

export function useRecoilData(): RecoilData {
  const diffs = useRecoilValue(diffsAtom);
  const [snapshots, setSnapshots] = useRecoilState(snapshotsAtom);
  const setPreviousSnapshot = useSetRecoilState(previousSnapshotAtom);

  const handleDelete = useCallback(() => {
    setPreviousSnapshot(snapshots[snapshots.length - 1]);
    setSnapshots([]);
  }, [setPreviousSnapshot, setSnapshots, snapshots]);

  return useMemo(
    () => ({
      type: 'recoil',
      icon: 'https://recoiljs.org/img/favicon.png',
      rows: diffs,
      name: (diff) => {
        if (diff.initial) return 'Initial';
        return Object.keys(diff.nodes).sort().join(', ');
      },
      query: (diff) => {
        let baseQuery = JSON.stringify(diff.nodes);

        if (diff.initial) {
          baseQuery += 'initial';
        }

        return baseQuery;
      },
      onDelete: handleDelete,
    }),
    [diffs, handleDelete],
  );
}

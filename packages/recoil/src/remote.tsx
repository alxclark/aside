import {useEffect} from 'react';
import {useRecoilCallback} from 'recoil';
import {usePersistedState} from '@aside/react';
import {TimelineStorageKey} from '@aside/chrome-ui';

import {
  currentStateAtom,
  Snapshot,
  snapshotsAtom,
} from './foundation/Snapshots';

export function RemoteDevTools({snapshot}: {snapshot: Snapshot}) {
  const [{data: recordSnapshot}] = usePersistedState(false, {
    key: TimelineStorageKey.RecordSnapshot,
  });

  const updateSnapshots = useRecoilCallback(
    ({snapshot: recoilSnapshot, set}) =>
      () => {
        if (!recordSnapshot) return;

        const snapshots = recoilSnapshot.getLoadable(snapshotsAtom).getValue();
        const isSameSnapshot =
          snapshots[snapshots.length - 1]?.id === snapshot.id;

        if (isSameSnapshot) return;

        set(currentStateAtom, snapshot);

        set(snapshotsAtom, (prev) => {
          return [...prev, snapshot];
        });
      },
    [snapshot, recordSnapshot],
  );

  useEffect(() => {
    updateSnapshots();
  }, [updateSnapshots]);

  return null;
}

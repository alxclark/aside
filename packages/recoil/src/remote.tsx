import React, {useEffect, useRef} from 'react';
import {useRecoilCallback, useRecoilValue, useSetRecoilState} from 'recoil';

import {
  currentStateAtom,
  recordSnapshotAtom,
  Snapshot,
  snapshotsAtom,
} from './foundation/Snapshots';

export function RemoteDevTools({snapshot}: {snapshot: Snapshot}) {
  const shouldRecordSnapshot = useRecoilValue(recordSnapshotAtom);

  const updateSnapshots = useRecoilCallback(
    ({snapshot: recoilSnapshot, set}) =>
      () => {
        const snapshots = recoilSnapshot.getLoadable(snapshotsAtom).getValue();
        const isSameSnapshot =
          snapshots[snapshots.length - 1]?.id === snapshot.id;

        if (isSameSnapshot) return;

        set(currentStateAtom, snapshot);

        set(snapshotsAtom, (prev) => {
          return [...prev, snapshot];
        });
      },
    [snapshot, shouldRecordSnapshot],
  );

  useEffect(() => {
    updateSnapshots();
  }, [updateSnapshots]);

  return null;
}

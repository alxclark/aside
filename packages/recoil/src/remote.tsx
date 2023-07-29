import {useEffect} from 'react';
import {useRecoilCallback} from 'recoil';
import {useExtensionApi, useLocalStorageState} from '@aside/react';

import {
  currentStateAtom,
  Snapshot,
  snapshotsAtom,
} from './foundation/Snapshots';

export function RemoteDevTools({snapshot}: {snapshot: Snapshot}) {
  const {
    timeline: {recordSnapshot},
  } = useExtensionApi();

  const updateSnapshots = useRecoilCallback(
    ({snapshot: recoilSnapshot, set}) =>
      () => {
        if (!recordSnapshot[0].data) return;

        const snapshots = recoilSnapshot.getLoadable(snapshotsAtom).getValue();
        const isSameSnapshot =
          snapshots[snapshots.length - 1]?.id === snapshot.id;

        if (isSameSnapshot) return;

        set(currentStateAtom, snapshot);

        set(snapshotsAtom, (prev) => {
          return [...prev, snapshot];
        });
      },
    [snapshot, !recordSnapshot[0].data],
  );

  useEffect(() => {
    updateSnapshots();
  }, [updateSnapshots]);

  return null;
}

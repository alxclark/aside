import React, {useEffect, useRef} from 'react';
import {useRecoilValue, useSetRecoilState} from 'recoil';

import {PrimaryPanel} from './components';
import {
  currentStateAtom,
  recordSnapshotAtom,
  Snapshot,
  snapshotsAtom,
} from './foundation/Snapshots';

export function RemoteDevTools({snapshot}: {snapshot: Snapshot}) {
  const shouldRecordSnapshot = useRecoilValue(recordSnapshotAtom);
  const setSnapshots = useSetRecoilState(snapshotsAtom);
  const setCurrentState = useSetRecoilState(currentStateAtom);
  const lastSnapshotRef = useRef<string | null>(null);

  useEffect(() => {
    setCurrentState(snapshot);

    if (!shouldRecordSnapshot || snapshot.id === lastSnapshotRef.current) {
      lastSnapshotRef.current = snapshot.id;
      return;
    }

    setSnapshots((prev) => {
      if (prev[prev.length - 1]?.id === snapshot.id) {
        return prev;
      }
      return [...prev, snapshot];
    });
  }, [setCurrentState, setSnapshots, shouldRecordSnapshot, snapshot]);

  return <PrimaryPanel />;
}

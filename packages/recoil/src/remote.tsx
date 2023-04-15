import React, {useEffect, useRef} from 'react';
import {useRecoilValue, useSetRecoilState} from 'recoil';

import {PrimaryPanel} from './components';
import {
  currentStateAtom,
  diffsAtom,
  recordSnapshotAtom,
  Snapshot,
  snapshotsAtom,
} from './foundation/Snapshots';

export function RemoteDevTools({
  snapshot,
  diff,
}: {
  snapshot: Snapshot;
  diff: Snapshot;
}) {
  const shouldRecordSnapshot = useRecoilValue(recordSnapshotAtom);
  const setSnapshots = useSetRecoilState(snapshotsAtom);
  const setDiffs = useSetRecoilState(diffsAtom);
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

    setDiffs((prev) => {
      if (prev[prev.length - 1]?.id === diff.id) {
        return prev;
      }
      return [...prev, diff];
    });
  }, [
    diff,
    setCurrentState,
    setDiffs,
    setSnapshots,
    shouldRecordSnapshot,
    snapshot,
  ]);

  return <PrimaryPanel />;
}

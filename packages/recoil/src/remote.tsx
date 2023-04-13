import React, {useEffect} from 'react';
import {
  Snapshot as RecoilSnapshot,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';

import {PrimaryPanel} from './components';
import {isInternalAtom} from './utilities/recoil';
import {
  currentStateAtom,
  diffsAtom,
  initialStateAtom,
  recordSnapshotAtom,
  Snapshot,
  snapshotsAtom,
} from './foundation/Snapshots';

export function RemoteDevTools({
  snapshot: recoilSnapshot,
}: {
  snapshot: RecoilSnapshot;
}) {
  const shouldRecordSnapshot = useRecoilValue(recordSnapshotAtom);
  const setSnapshots = useSetRecoilState(snapshotsAtom);
  const setDiffs = useSetRecoilState(diffsAtom);
  const setCurrentState = useSetRecoilState(currentStateAtom);
  const [initialState, setInitialState] = useRecoilState(initialStateAtom);

  useEffect(() => {
    const createdAt = new Date();

    const snapshot: Snapshot = {
      id: recoilSnapshot.getID(),
      createdAt,
      nodes: {},
    };

    if (initialState?.id === snapshot.id) return;

    for (const node of recoilSnapshot.getNodes_UNSTABLE()) {
      if (isInternalAtom(node.key)) continue;

      const parts = node.key.split('__');
      const hasAtomFamilyPrefix = parts.length > 1;
      if (hasAtomFamilyPrefix) {
        const [prefix, ...rest] = parts;
        const itemKey = rest.join('').replaceAll('"', '');

        snapshot.nodes[prefix] ||= {};
        snapshot.nodes[prefix][itemKey] = recoilSnapshot
          .getLoadable(node)
          .getValue();
      } else {
        snapshot.nodes[node.key] = recoilSnapshot.getLoadable(node).getValue();
      }
    }

    const diff: Snapshot = {
      id: recoilSnapshot.getID(),
      createdAt,
      nodes: {},
    };

    for (const node of recoilSnapshot.getNodes_UNSTABLE({isModified: true})) {
      if (isInternalAtom(node.key)) continue;
      diff.nodes[node.key] = recoilSnapshot.getLoadable(node).getValue();
    }

    setCurrentState(snapshot);

    if (!initialState) {
      setInitialState(snapshot);
    }

    if (!shouldRecordSnapshot) return;

    setSnapshots((prev) => [...prev, snapshot]);
    setDiffs((prev) => [...prev, initialState ? diff : snapshot]);
  }, [
    initialState,
    recoilSnapshot,
    setCurrentState,
    setDiffs,
    setInitialState,
    setSnapshots,
    shouldRecordSnapshot,
  ]);

  return <PrimaryPanel />;
}

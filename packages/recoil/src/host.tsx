import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {Aside, DevTools as AsideDevTools} from '@aside/react';
import {
  RecoilRoot,
  useRecoilSnapshot,
  Snapshot as RecoilSnapshot,
} from 'recoil';

import {RemoteDevTools} from './remote';
import {
  currentStateAtom,
  diffsAtom,
  initialStateAtom,
  Snapshot,
  snapshotsAtom,
} from './foundation/Snapshots';
import {isInternalAtom} from './utilities/recoil';

export function DevTools({children}: PropsWithChildren<{}>) {
  const recoilSnapshot = useRecoilSnapshot();
  const {snapshot, diff} = useMemo(
    () => transformSnapshot(recoilSnapshot),
    [recoilSnapshot],
  );

  const [diffs, setDiffs] = useState<Snapshot[]>([]);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);

  // Persist the state snapshots client side.
  // This is needed since we want access to the previous states
  // even if the devtools panel was not opened.
  useEffect(() => {
    setSnapshots((prev) => [...prev, snapshot]);
    setDiffs((prev) => [...prev, diff]);
  }, [setDiffs, snapshot, diff]);

  return (
    <Aside>
      <AsideDevTools>
        <RecoilRoot
          key="@aside/recoil"
          initializeState={(snapshot) => {
            snapshot.set(snapshotsAtom, snapshots);
            snapshot.set(initialStateAtom, snapshots[0]);
            snapshot.set(currentStateAtom, snapshots[snapshots.length - 1]);

            const [_emptyDiff, ...rest] = diffs;
            snapshot.set(diffsAtom, [snapshots[0], ...rest]);
          }}
        >
          <RemoteDevTools snapshot={snapshot} diff={diff} />
        </RecoilRoot>
        {children}
      </AsideDevTools>
    </Aside>
  );
}

// Recoil snapshots need to be manually retained in order to extract the data from it.
// In order to make it simpler to pass it to the remote, we pre-process
// each snapshot and generate an object containing all values and a diff of the state.
function transformSnapshot(recoilSnapshot: RecoilSnapshot) {
  const createdAt = new Date();

  const snapshot: Snapshot = {
    id: String(recoilSnapshot.getID()),
    createdAt,
    nodes: {},
  };

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
    id: String(recoilSnapshot.getID()),
    createdAt,
    nodes: {},
  };

  for (const node of recoilSnapshot.getNodes_UNSTABLE({isModified: true})) {
    if (isInternalAtom(node.key)) continue;
    diff.nodes[node.key] = recoilSnapshot.getLoadable(node).getValue();
  }

  return {diff, snapshot};
}

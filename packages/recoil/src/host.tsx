import React, {
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {Aside, DevTools as AsideDevTools} from '@aside/react';
import {useRecoilSnapshot, Snapshot as RecoilSnapshot} from 'recoil';

import {RemoteDevTools} from './remote';
import {Snapshot} from './foundation/Snapshots';
import {isInternalAtom} from './utilities/recoil';
import {InitialStateProvider} from './foundation/InitialState';

export type Props = PropsWithChildren<{
  ignoredRecoilKeys?: string[];
}>;

export function DevTools({children, ignoredRecoilKeys}: Props) {
  const recoilSnapshot = useRecoilSnapshot();
  const {snapshot} = useMemo(
    () => transformSnapshot(recoilSnapshot, {ignoredRecoilKeys}),
    [ignoredRecoilKeys, recoilSnapshot],
  );

  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const snapshotCount = useRef(0);

  // Persist the state snapshots client side.
  // This is needed since we want access to the previous states
  // even if the devtools panel was not opened.
  useEffect(() => {
    if (snapshotCount.current === 0) {
      setSnapshots((prev) => [...prev, {...snapshot, initial: true}]);
    } else {
      setSnapshots((prev) => [...prev, snapshot]);
    }

    snapshotCount.current += 1;
  }, [snapshot]);

  return (
    <Aside>
      <AsideDevTools>
        <RecoilDevTools snapshots={snapshots} snapshot={snapshot}>
          {children}
        </RecoilDevTools>
      </AsideDevTools>
    </Aside>
  );
}

function RecoilDevTools({children, snapshots, snapshot}: any) {
  return (
    <InitialStateProvider snapshots={snapshots}>
      <RemoteDevTools snapshot={snapshot} />
      {children}
    </InitialStateProvider>
  );
}

// Recoil snapshots need to be manually retained in order to extract the data from it.
// In order to make it simpler to pass it to the remote, we pre-process
// each snapshot and generate an object containing all values and a diff of the state.
function transformSnapshot(
  recoilSnapshot: RecoilSnapshot,
  options: {ignoredRecoilKeys?: string[]},
) {
  const createdAt = new Date().getTime().toString();
  const id = `${String(recoilSnapshot.getID())}-${createdAt}`;

  const snapshot: Snapshot = {
    id,
    createdAt,
    nodes: {},
  };

  for (const node of recoilSnapshot.getNodes_UNSTABLE()) {
    if (isInternalAtom(node.key)) continue;

    const parts = node.key.split('__');
    const hasAtomFamilyPrefix = parts.length > 1;

    if (hasAtomFamilyPrefix) {
      const [prefix, ...rest] = parts;

      if (options.ignoredRecoilKeys?.includes(prefix)) continue;

      const itemKey = rest
        .join('')
        .replaceAll('"', '')
        .replace('selectorFamily/', '')
        .split('/')[0];

      snapshot.nodes[prefix] ||= {};
      snapshot.nodes[prefix][itemKey] = recoilSnapshot
        .getLoadable(node)
        .getValue();
    } else {
      snapshot.nodes[node.key] = recoilSnapshot.getLoadable(node).getValue();
    }
  }

  return {snapshot};
}

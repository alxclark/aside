import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {Aside, DevTools as AsideDevTools, useExtensionApi} from '@aside/react';
import {
  RecoilRoot,
  useRecoilSnapshot,
  Snapshot as RecoilSnapshot,
} from 'recoil';

import {RemoteDevTools} from './remote';
import {
  currentStateAtom,
  diffsAtom,
  filterAtom,
  preserveLogAtom,
  recordSnapshotAtom,
  selectedDiffBaseAtom,
  showFilterAtom,
  Snapshot,
  snapshotsAtom,
} from './foundation/Snapshots';
import {isInternalAtom} from './utilities/recoil';
import {extensionApiAtom} from './foundation/Extension';
import {
  primaryNavigationAtom,
  PrimaryNavigation,
} from './foundation/Navigation';

export function DevTools({children}: PropsWithChildren<{}>) {
  const recoilSnapshot = useRecoilSnapshot();
  const {snapshot, diff} = useMemo(
    () => transformSnapshot(recoilSnapshot),
    [recoilSnapshot],
  );

  const [diffs, setDiffs] = useState<Snapshot[]>([]);
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
    setDiffs((prev) => [...prev, diff]);
    snapshotCount.current += 1;
  }, [setDiffs, snapshot, diff]);

  return (
    <Aside>
      <AsideDevTools>
        <RecoilDevTools
          snapshots={snapshots}
          snapshot={snapshot}
          diff={diff}
          diffs={diffs}
        >
          {children}
        </RecoilDevTools>
      </AsideDevTools>
    </Aside>
  );
}

interface PersistedState {
  filter?: string;
  showFilter?: boolean;
  preserveLog?: boolean;
  recordSnapshot?: boolean;
  diffs?: Snapshot[];
  selectedDiff?: string;
  primaryNavigation?: PrimaryNavigation;
}

function RecoilDevTools({children, snapshots, diffs, snapshot, diff}: any) {
  const api = useExtensionApi();
  const [persistedState, setPersistedState] = useState<
    PersistedState | undefined
  >();

  useEffect(() => {
    async function queryExtensionStorage() {
      try {
        const result = await api.storage.local.get([
          filterAtom.key,
          showFilterAtom.key,
          preserveLogAtom.key,
          recordSnapshotAtom.key,
          diffsAtom.key,
          selectedDiffBaseAtom.key,
          primaryNavigationAtom.key,
        ]);

        setPersistedState({
          filter: result[filterAtom.key],
          showFilter: result[showFilterAtom.key],
          preserveLog: result[preserveLogAtom.key],
          recordSnapshot: result[recordSnapshotAtom.key],
          diffs: result[diffsAtom.key],
          selectedDiff: result[selectedDiffBaseAtom.key],
          primaryNavigation: result[primaryNavigationAtom.key],
        });
      } catch (error) {
        // TODO: Wipe all of local storage
        setPersistedState({});
      }
    }

    queryExtensionStorage();
  }, [api.storage.local]);

  if (!persistedState) return null;

  return (
    <>
      <RecoilRoot
        key="@aside/recoil"
        initializeState={(snapshot) => {
          snapshot.set(extensionApiAtom, api);
          snapshot.set(snapshotsAtom, snapshots);
          snapshot.set(currentStateAtom, snapshots[snapshots.length - 1]);

          const [, ...rest] = diffs;

          if (persistedState.recordSnapshot !== false) {
            const reconciledDiffs = [
              ...(persistedState.diffs ?? []),
              snapshots[0],
              ...rest,
            ];

            api.storage.local.set({[diffsAtom.key]: reconciledDiffs});

            snapshot.set(diffsAtom, reconciledDiffs);
          }

          if (persistedState.primaryNavigation) {
            snapshot.set(
              primaryNavigationAtom,
              persistedState.primaryNavigation,
            );
          }

          if (persistedState.selectedDiff) {
            snapshot.set(selectedDiffBaseAtom, persistedState.selectedDiff);
          }

          if (persistedState.filter) {
            snapshot.set(filterAtom, persistedState.filter);
          }

          if (persistedState.preserveLog) {
            snapshot.set(preserveLogAtom, persistedState.preserveLog);
          }

          if (persistedState.recordSnapshot !== undefined) {
            snapshot.set(recordSnapshotAtom, persistedState.recordSnapshot);
          }

          if (persistedState.showFilter) {
            snapshot.set(showFilterAtom, persistedState.showFilter);
          }
        }}
      >
        <RemoteDevTools snapshot={snapshot} diff={diff} />
      </RecoilRoot>
      {children}
    </>
  );
}

// Recoil snapshots need to be manually retained in order to extract the data from it.
// In order to make it simpler to pass it to the remote, we pre-process
// each snapshot and generate an object containing all values and a diff of the state.
function transformSnapshot(recoilSnapshot: RecoilSnapshot) {
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
    id,
    createdAt,
    nodes: {},
  };

  for (const node of recoilSnapshot.getNodes_UNSTABLE({isModified: true})) {
    if (isInternalAtom(node.key)) continue;
    diff.nodes[node.key] = recoilSnapshot.getLoadable(node).getValue();
  }

  return {diff, snapshot};
}

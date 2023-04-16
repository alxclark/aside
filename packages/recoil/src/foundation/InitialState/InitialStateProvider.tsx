import {useExtensionApi} from '@aside/react';
import React, {useEffect, useState} from 'react';
import {RecoilRoot} from 'recoil';

import {extensionApiAtom} from '../Extension';
import {primaryNavigationAtom} from '../Navigation';
import {
  filterAtom,
  showFilterAtom,
  preserveLogAtom,
  recordSnapshotAtom,
  diffsAtom,
  selectedDiffBaseAtom,
  snapshotsAtom,
  currentStateAtom,
  Snapshot,
} from '../Snapshots';

import {PersistedState} from './types';

export interface Props {
  children: React.ReactNode;
  snapshots: Snapshot[];
  diffs: Snapshot[];
}

export function InitialStateProvider({children, snapshots, diffs}: Props) {
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
        setPersistedState({});
        api.storage.local.set({
          [filterAtom.key]: undefined,
          [showFilterAtom.key]: undefined,
          [preserveLogAtom.key]: undefined,
          [recordSnapshotAtom.key]: undefined,
          [diffsAtom.key]: undefined,
          [selectedDiffBaseAtom.key]: undefined,
          [primaryNavigationAtom.key]: undefined,
        });
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

          const reconciledDiffs = [
            ...(persistedState.preserveLog ? persistedState.diffs ?? [] : []),
            ...(persistedState.recordSnapshot ? [snapshots[0]] : []),
            ...(persistedState.recordSnapshot ? rest : []),
          ];

          api.storage.local.set({[diffsAtom.key]: reconciledDiffs});

          snapshot.set(diffsAtom, reconciledDiffs);

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

          if (persistedState.preserveLog !== undefined) {
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
        {children}
      </RecoilRoot>
    </>
  );
}

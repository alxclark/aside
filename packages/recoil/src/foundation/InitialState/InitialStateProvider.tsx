import {useExtensionApi} from '@aside/react';
import React, {useEffect, useState} from 'react';
import {RecoilRoot} from 'recoil';

import {extensionApiAtom} from '../Extension';
import {
  snapshotsAtom,
  currentStateAtom,
  Snapshot,
  previousSnapshotAtom,
} from '../Snapshots';

import {PersistedState} from './types';

export interface Props {
  children: React.ReactNode;
  snapshots: Snapshot[];
}

export function InitialStateProvider({children, snapshots}: Props) {
  const api = useExtensionApi();
  const [persistedState, setPersistedState] = useState<
    PersistedState | undefined
  >();

  useEffect(() => {
    async function queryExtensionStorage() {
      try {
        const result = await api.storage.local.get([
          snapshotsAtom.key,
          previousSnapshotAtom.key,
        ]);

        setPersistedState({
          snapshots: result[snapshotsAtom.key],
          previousSnapshot: result[previousSnapshotAtom.key],
        });
      } catch (error) {
        setPersistedState({});
        api.storage.local.set({
          [snapshotsAtom.key]: undefined,
          [previousSnapshotAtom.key]: undefined,
        });
      }
    }

    queryExtensionStorage();
  }, [api.storage.local, setPersistedState]);

  if (!persistedState) return null;

  return (
    <RecoilRoot
      key="@aside/recoil"
      initializeState={(snapshot) => {
        snapshot.set(extensionApiAtom, api);
        snapshot.set(currentStateAtom, snapshots[snapshots.length - 1]);

        const [, ...rest] = snapshots;

        const reconciledSnapshots = [
          ...(persistedState.preserveLog === true
            ? persistedState.snapshots ?? []
            : []),
          ...(persistedState.recordSnapshot === false ? [] : [snapshots[0]]),
          ...(persistedState.recordSnapshot ? rest : []),
        ];

        api.storage.local.set({[snapshotsAtom.key]: reconciledSnapshots});

        snapshot.set(snapshotsAtom, reconciledSnapshots);

        if (persistedState.previousSnapshot) {
          snapshot.set(previousSnapshotAtom, persistedState.previousSnapshot);
        }
      }}
    >
      {children}
    </RecoilRoot>
  );
}

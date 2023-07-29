import {useExtensionApi, useLocalStorageState} from '@aside/react';
import React from 'react';
import {RecoilRoot} from 'recoil';

import {extensionApiAtom} from '../Extension';
import {
  snapshotsAtom,
  currentStateAtom,
  Snapshot,
  previousSnapshotAtom,
} from '../Snapshots';

export interface Props {
  children: React.ReactNode;
  snapshots: Snapshot[];
}

export function InitialStateProvider({children, snapshots}: Props) {
  const api = useExtensionApi();
  const {timeline} = api;

  const filter = timeline.filter[0];
  const invertFilter = timeline.invertFilter[0];
  const showFilter = timeline.showFilter[0];
  const preserveLog = timeline.preserveLog[0];
  const recordSnapshot = timeline.recordSnapshot[0];

  const [persistedSnapshots] = useLocalStorageState<Snapshot[]>([], {
    key: snapshotsAtom.key,
  });

  const [previousSnapshot] = useLocalStorageState<Snapshot | undefined>(
    undefined,
    {
      key: previousSnapshotAtom.key,
    },
  );

  const extensionStorageLoading =
    filter.loading ||
    invertFilter.loading ||
    showFilter.loading ||
    preserveLog.loading ||
    recordSnapshot.loading ||
    previousSnapshot.loading ||
    persistedSnapshots.loading;

  if (extensionStorageLoading) return null;

  return (
    <RecoilRoot
      key="@aside/recoil"
      initializeState={(snapshot) => {
        snapshot.set(extensionApiAtom, api);
        snapshot.set(currentStateAtom, snapshots[snapshots.length - 1]);

        const [, ...rest] = snapshots;

        const reconciledSnapshots = [
          ...(preserveLog.data === true ? persistedSnapshots.data ?? [] : []),
          ...(recordSnapshot.data === false ? [] : [snapshots[0]]),
          ...(recordSnapshot.data ? rest : []),
        ];

        api.storage.local.set({[snapshotsAtom.key]: reconciledSnapshots});

        snapshot.set(snapshotsAtom, reconciledSnapshots);

        if (previousSnapshot.data) {
          snapshot.set(previousSnapshotAtom, previousSnapshot.data);
        }
      }}
    >
      {children}
    </RecoilRoot>
  );
}

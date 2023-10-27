import React, {PropsWithChildren, useEffect, useMemo, useState} from 'react';
import {useLocalStorageState} from '@aside/react';

import {Snapshot, ActivityStore, ActivityStoreDescriptor} from '../types';
import {createDiff} from '../diff';
import {ActivityStoreContext} from '../contexts';
import {useActivity} from '../hooks';

export type Props = PropsWithChildren<{
  activity: ActivityStoreDescriptor<any>[];
}>;

export function ActivityProvider({activity, children}: Props) {
  const [initialSnapshots, setInitialSnapshots] = useState<
    | {
        [key: string]: Snapshot[];
      }
    | undefined
  >(undefined);

  const {
    preserveLog: [preserveLog],
    recordSnapshot: [recordSnapshot],
  } = useActivity();

  const [{data: persistedSnapshots, loading}, setPersistedSnapshots] =
    useLocalStorageState<{[key: string]: Snapshot[]} | undefined>(undefined, {
      key: `snapshots`,
      scope: 'host',
    });

  useEffect(() => {
    activity.forEach((store) =>
      store.monitor.setRecordSnapshot?.(recordSnapshot),
    );
  }, [activity, recordSnapshot]);

  useEffect(() => {
    if (!loading && persistedSnapshots && !initialSnapshots) {
      setInitialSnapshots(preserveLog ? persistedSnapshots : {});
    }
  }, [
    initialSnapshots,
    loading,
    persistedSnapshots,
    preserveLog,
    recordSnapshot,
  ]);

  useEffect(() => {
    if (loading || !preserveLog) return;

    const result = activity.reduce<{[key: string]: Snapshot[]}>(
      (prev, curr) => {
        prev[curr.type] = [
          ...(initialSnapshots?.[curr.type] ?? []),
          ...curr.monitor.snapshots,
        ];
        return prev;
      },
      {},
    );

    setPersistedSnapshots(result, {
      persist: preserveLog,
    });
  }, [activity, initialSnapshots, loading, preserveLog, setPersistedSnapshots]);

  const value: ActivityStore[] = useMemo(() => {
    return activity.map((store) => ({
      data: {
        type: store.type,
        icon: store.icon ?? {source: 'file-script'},
        name: (row: Snapshot) => {
          if (store.rowName) return store.rowName(row);
          if (row.initial) return 'Initial';

          return Object.keys(row.nodes).sort().join(', ');
        },
        query: (row: Snapshot) => {
          let baseQuery = JSON.stringify(row.nodes);

          if (row.initial) {
            baseQuery += 'initial';
          }

          return baseQuery;
        },
        rows: getRows(store, initialSnapshots ?? {}),
        displayName: store.displayName,
        onDelete: () => {
          store.monitor.clearSnapshots?.();
          setPersistedSnapshots({});
          setInitialSnapshots({});
        },
      },
      monitor: {
        ...store.monitor,
        snapshots: [
          ...(initialSnapshots?.[store.type] ?? []),
          ...store.monitor.snapshots,
        ],
      },
    }));
  }, [activity, initialSnapshots, setPersistedSnapshots]);

  return (
    <ActivityStoreContext.Provider value={value}>
      {children}
    </ActivityStoreContext.Provider>
  );
}

function getRows(
  store: ActivityStoreDescriptor,
  initialSnapshots: {
    [key: string]: Snapshot[];
  },
) {
  const snapshots = [
    ...(initialSnapshots[store.type] ?? []),
    ...store.monitor.snapshots,
  ];

  if (!store.monitor.diff) return snapshots;

  return snapshots.map((next, index) => {
    const prev = snapshots[index - 1] ?? store.monitor.previous ?? {};

    if (prev.initial || next.initial) {
      return {
        id: next.id,
        createdAt: next.createdAt,
        nodes: next.nodes,
        initial: next.initial,
      };
    }

    const nodes = createDiff({
      previous: prev.nodes,
      next: next.nodes,
    });

    return {
      id: next.id,
      createdAt: next.createdAt,
      nodes,
    };
  });
}

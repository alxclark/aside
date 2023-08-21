import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {useExtensionApi, useLocalStorageState} from '@aside/react';

import {
  ActivityData,
  Snapshot,
  Monitor,
  ActivityStore,
  ActivityStoreDescriptor,
} from '../types';
import {createDiff} from '../diff';
import {ActivityStoreContextMap} from '../contexts';

export type Props = PropsWithChildren<ActivityStoreDescriptor>;

export function ActivityStoreProvider({
  type,
  rowName,
  icon,
  displayName,
  monitor: {
    snapshot,
    snapshots,
    clearSnapshots,
    previous,
    setRecordSnapshot,
    skipDiffing,
  },
  children,
}: Props) {
  const [initialSnapshots, setInitialSnapshots] = useState<
    Snapshot[] | undefined
  >(undefined);

  const [preserveLog] = useExtensionApi().timeline.preserveLog;
  const recordSnapshot = useExtensionApi().timeline.recordSnapshot[0];

  const [{data: persistedSnapshots, loading}, setPersistedSnapshots] =
    useLocalStorageState<Snapshot[] | undefined>(undefined, {
      key: `${type}-snapshots`,
      scope: 'host',
    });

  useEffect(() => {
    if (recordSnapshot.loading) return;
    setRecordSnapshot?.(recordSnapshot.data);
  }, [recordSnapshot.data, recordSnapshot.loading, setRecordSnapshot]);

  useEffect(() => {
    if (
      !loading &&
      persistedSnapshots &&
      !initialSnapshots &&
      !preserveLog.loading
    ) {
      setInitialSnapshots(preserveLog.data ? persistedSnapshots : []);
    }
  }, [
    initialSnapshots,
    loading,
    persistedSnapshots,
    preserveLog.data,
    preserveLog.loading,
  ]);

  const monitor: Monitor = useMemo(
    () => ({
      snapshot,
      snapshots: [...(initialSnapshots ?? []), ...snapshots],
      clearSnapshots,
      previous,
      skipDiffing,
    }),
    [
      clearSnapshots,
      initialSnapshots,
      previous,
      skipDiffing,
      snapshot,
      snapshots,
    ],
  );

  const rows: Snapshot[] = useMemo(() => {
    if (monitor.skipDiffing) return monitor.snapshots;

    return monitor.snapshots.map((next, index) => {
      const prev = monitor.snapshots[index - 1] ?? previous ?? {};

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
  }, [monitor.skipDiffing, monitor.snapshots, previous]);

  const name = useCallback(
    (row: Snapshot) => {
      if (rowName) return rowName(row);
      if (row.initial) return 'Initial';

      return Object.keys(row.nodes).sort().join(', ');
    },
    [rowName],
  );

  const query = useCallback((row: Snapshot) => {
    let baseQuery = JSON.stringify(row.nodes);

    if (row.initial) {
      baseQuery += 'initial';
    }

    return baseQuery;
  }, []);

  useEffect(() => {
    if (loading || preserveLog.loading) return;

    setPersistedSnapshots(monitor.snapshots, {
      persist: preserveLog.data,
    });
  }, [
    loading,
    monitor.snapshots,
    preserveLog.data,
    preserveLog.loading,
    setPersistedSnapshots,
  ]);

  const data: ActivityData = useMemo(
    () => ({
      type,
      icon: icon ?? '',
      name,
      query,
      rows,
      displayName,
      onDelete: () => {
        clearSnapshots?.();
        setPersistedSnapshots([]);
        setInitialSnapshots([]);
      },
    }),
    [
      clearSnapshots,
      displayName,
      icon,
      name,
      query,
      rows,
      setPersistedSnapshots,
      type,
    ],
  );

  const Context = useMemo(() => {
    const existingContext = ActivityStoreContextMap.get(type);

    if (existingContext) return existingContext;

    const newContext = createContext<ActivityStore>({
      data,
      monitor,
    });

    ActivityStoreContextMap.set(type, newContext);

    return newContext;
  }, [monitor, type, data]);

  const value: ActivityStore = useMemo(
    () => ({
      data,
      monitor,
    }),
    [monitor, data],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

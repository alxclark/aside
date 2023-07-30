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
  TimelineData,
  Snapshot,
  Observer,
  DataStore,
  DataStoreDescriptor,
} from '../types';
import {createDiff} from '../diff';
import {DataStoresContextMap} from '../contexts';

export type Props = PropsWithChildren<DataStoreDescriptor>;

export function DataProvider({
  type,
  icon,
  observer: {snapshot, snapshots, clearSnapshots, previous},
  children,
}: Props) {
  const [initialSnapshots, setInitialSnapshots] = useState<
    Snapshot[] | undefined
  >(undefined);

  const [preserveLog] = useExtensionApi().timeline.preserveLog;

  const [{data: persistedSnapshots, loading}, setPersistedSnapshots] =
    useLocalStorageState<Snapshot[] | undefined>(undefined, {
      key: `${type}-snapshots`,
    });

  useEffect(() => {
    if (!loading && persistedSnapshots && !initialSnapshots) {
      setInitialSnapshots(persistedSnapshots);
    }
  }, [initialSnapshots, loading, persistedSnapshots]);

  const observer: Observer = useMemo(
    () => ({
      snapshot,
      snapshots: [...(initialSnapshots ?? []), ...snapshots],
      clearSnapshots,
      previous,
    }),
    [clearSnapshots, initialSnapshots, previous, snapshot, snapshots],
  );

  const rows: Snapshot[] = useMemo(() => {
    return observer.snapshots.map((next, index) => {
      const prev = observer.snapshots[index - 1] ?? previous ?? {};

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
  }, [observer.snapshots, previous]);

  const name = useCallback((row: Snapshot) => {
    if (row.initial) return 'Initial';

    return Object.keys(row.nodes).sort().join(', ');
  }, []);

  const query = useCallback((row: Snapshot) => {
    let baseQuery = JSON.stringify(row.nodes);

    if (row.initial) {
      baseQuery += 'initial';
    }

    return baseQuery;
  }, []);

  useEffect(() => {
    if (!loading) {
      setPersistedSnapshots(observer.snapshots, {
        persist: preserveLog.data,
      });
    }
  }, [loading, observer.snapshots, preserveLog.data, setPersistedSnapshots]);

  const timeline: TimelineData = useMemo(
    () => ({
      type,
      icon: icon ?? '',
      name,
      query,
      rows,
      onDelete: () => {
        clearSnapshots?.();
        setPersistedSnapshots([]);
        setInitialSnapshots([]);
      },
    }),
    [clearSnapshots, icon, name, query, rows, setPersistedSnapshots, type],
  );

  const Context = useMemo(() => {
    const existingContext = DataStoresContextMap.get(type);

    if (existingContext) return existingContext;

    const newContext = createContext<DataStore>({
      data: timeline,
      observer,
    });

    DataStoresContextMap.set(type, newContext);

    return newContext;
  }, [observer, type, timeline]);

  const value: DataStore = useMemo(
    () => ({
      data: timeline,
      observer,
    }),
    [observer, timeline],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

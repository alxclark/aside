import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {useExtensionApi, useLocalStorageState} from '@aside/react';

import {ReactObserverContext, ReactTimelineContext} from '../../contexts';
import {Observer, Snapshot} from '../../types';
import {createDiff} from '../../diff';
import {TimelineItemData} from '../../Timeline';

export function ReactDevTools({
  snapshot,
  snapshots,
  clearSnapshots,
  children,
  previous,
}: PropsWithChildren<Observer>) {
  const [initialSnapshots, setInitialSnapshots] = useState<
    Snapshot[] | undefined
  >(undefined);

  const [preserveLog] = useExtensionApi().timeline.preserveLog;

  const [{data: persistedSnapshots, loading}, setPersistedSnapshots] =
    useLocalStorageState<Snapshot[] | undefined>(undefined, {
      key: 'react-snapshots',
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

  const rows: TimelineItemData[] = useMemo(() => {
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

  const name = useCallback((row: TimelineItemData) => {
    if (row.initial) return 'Initial';

    return Object.keys(row.nodes).sort().join(', ');
  }, []);

  const query = useCallback((row: TimelineItemData) => {
    let baseQuery = JSON.stringify(row.nodes);

    if (row.initial) {
      baseQuery += 'initial';
    }

    return baseQuery;
  }, []);

  const timeline = useMemo(
    () => ({
      type: 'react',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
      name,
      query,
      rows,
      onDelete: () => {
        clearSnapshots?.();
        setPersistedSnapshots([]);
        setInitialSnapshots([]);
      },
    }),
    [clearSnapshots, name, query, rows, setPersistedSnapshots],
  );

  useEffect(() => {
    if (!loading) {
      setPersistedSnapshots(observer.snapshots, {
        persist: preserveLog.data,
      });
    }
  }, [loading, observer.snapshots, preserveLog.data, setPersistedSnapshots]);

  return (
    <ReactObserverContext.Provider value={observer}>
      <ReactTimelineContext.Provider value={timeline}>
        {children}
      </ReactTimelineContext.Provider>
    </ReactObserverContext.Provider>
  );
}

import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {usePersistedState} from '@aside/react';

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
  const [{data: persistedSnapshots, loading}, setPersistedSnapshots] =
    usePersistedState<Snapshot[] | undefined>(undefined, {
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

  const name = useCallback(
    (row: TimelineItemData) => Object.keys(row.nodes).join(', '),
    [],
  );

  const query = useCallback(
    (row: TimelineItemData) => Object.keys(row.nodes).join(', '),
    [],
  );

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
      setPersistedSnapshots(observer.snapshots);
    }
  }, [loading, observer.snapshots, setPersistedSnapshots]);

  return (
    <ReactObserverContext.Provider value={observer}>
      <ReactTimelineContext.Provider value={timeline}>
        {children}
      </ReactTimelineContext.Provider>
    </ReactObserverContext.Provider>
  );
}

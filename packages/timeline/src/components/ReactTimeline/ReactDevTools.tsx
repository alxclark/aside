import {PropsWithChildren, useCallback, useMemo} from 'react';

import {ReactObserverContext, ReactTimelineContext} from '../../contexts';
import {Observer} from '../../types';
import {createDiff} from '../../diff';
import {TimelineItemData} from '../../Timeline';

export function ReactDevTools({
  snapshot,
  snapshots,
  clearSnapshots,
  children,
  previous,
}: PropsWithChildren<Observer>) {
  const rows: TimelineItemData[] = useMemo(() => {
    return snapshots.map((next, index) => {
      const prev = snapshots[index - 1]?.nodes ?? previous?.nodes ?? {};

      const nodes = createDiff({
        previous: prev,
        next: next.nodes,
      });

      return {
        id: next.id,
        createdAt: next.createdAt,
        nodes,
      };
    });
  }, [previous?.nodes, snapshots]);

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
      onDelete: () => clearSnapshots?.(),
    }),
    [clearSnapshots, name, query, rows],
  );

  const observer: Observer = useMemo(
    () => ({
      snapshot,
      snapshots,
      clearSnapshots,
      previous,
    }),
    [clearSnapshots, previous, snapshot, snapshots],
  );

  return (
    <ReactObserverContext.Provider value={observer}>
      <ReactTimelineContext.Provider value={timeline}>
        {children}
      </ReactTimelineContext.Provider>
    </ReactObserverContext.Provider>
  );
}

import {useCallback, useEffect, useMemo, useState} from 'react';

import {Observer, Snapshot} from '../types';

export function useObserver(
  object: {[key: string]: any},
  deps: any[],
): Observer {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);

  useEffect(() => {
    const createdAt = Date.now().toString();

    setSnapshots((prev) => [
      ...prev,
      {
        id: `object-${createdAt}`,
        createdAt,
        nodes: object,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps]);

  const clearSnapshots = useCallback(() => {
    console.log('whats up');
    setSnapshots((prev) => [prev[prev.length - 1]]);
  }, []);

  return useMemo(
    () => ({
      snapshot: snapshots[snapshots.length - 1],
      snapshots,
      clearSnapshots: () => console.log('hello m8'),
    }),
    [snapshots],
  );
}

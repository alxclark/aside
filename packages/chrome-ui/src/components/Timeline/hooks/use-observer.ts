import {useEffect, useMemo, useState} from 'react';

import {Observer, Snapshot} from '../types';

export function useObserver(object: {[key: string]: any}): Observer {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);

  useEffect(() => {
    return;
    const createdAt = Date.now().toString();

    setSnapshots((prev) => [
      ...prev,
      {
        id: `object-${createdAt}`,
        createdAt,
        nodes: object,
      },
    ]);
  }, [object]);

  return useMemo(
    () => ({
      snapshot: snapshots[snapshots.length - 1],
      snapshots,
    }),
    [snapshots],
  );
}

import {useCallback, useEffect, useMemo, useState} from 'react';

import {Observer, Snapshot} from '../types';

export function useObserver(
  object: {[key: string]: any},
  deps: any[],
): Observer {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [previous, setPrevious] = useState<Snapshot | undefined>();
  const [current, setCurrent] = useState<Snapshot | undefined>();

  useEffect(() => {
    const createdAt = Date.now().toString();

    const snapshot = {
      id: `object-${createdAt}`,
      createdAt,
      nodes: object,
    };

    setPrevious(current);
    setCurrent(snapshot);

    setSnapshots((prev) => [...prev, snapshot]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps]);

  const clearSnapshots = useCallback(() => {
    setSnapshots([]);
  }, []);

  return useMemo(
    () => ({
      previous,
      snapshot: current ?? {id: '0', createdAt: '', nodes: {}},
      snapshots,
      clearSnapshots,
    }),
    [clearSnapshots, current, previous, snapshots],
  );
}

import {useCallback, useEffect, useMemo, useState} from 'react';

import {Observer, Snapshot} from '../types';

export function useObserver(
  object: {[key: string]: any},
  deps: any[],
): Observer {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [previous, setPrevious] = useState<Snapshot>(empty);
  const [current, setCurrent] = useState<Snapshot>(empty);

  useEffect(() => {
    const createdAt = Date.now().toString();

    const snapshot = {
      id: `object-${createdAt}`,
      createdAt,
      nodes: object,
    };

    setCurrent(snapshot);

    setSnapshots((prev) => [...prev, snapshot]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps]);

  const clearSnapshots = useCallback(() => {
    setPrevious(current);
    setSnapshots([]);
  }, [current]);

  return useMemo(
    () => ({
      previous,
      snapshot: current,
      snapshots,
      clearSnapshots,
    }),
    [clearSnapshots, current, previous, snapshots],
  );
}

const empty: Snapshot = {id: '0', createdAt: '', nodes: {}};

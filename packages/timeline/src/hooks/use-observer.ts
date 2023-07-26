import {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {Observer, Snapshot} from '../types';

export function useObserver(
  object: {[key: string]: any},
  deps: any[],
): Observer {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [previous, setPrevious] = useState<Snapshot>(empty);
  const [current, setCurrent] = useState<Snapshot>(empty);
  const count = useRef(0);

  useEffect(() => {
    const createdAt = Date.now().toString();

    const snapshot: Snapshot = {
      id: `object-${createdAt}`,
      createdAt,
      nodes: object,
      initial: count.current === 0,
    };

    setCurrent(snapshot);

    setSnapshots((prev) => [...prev, snapshot]);

    count.current++;

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

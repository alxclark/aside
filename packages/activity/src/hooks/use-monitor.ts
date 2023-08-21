import {useCallback, useEffect, useId, useMemo, useRef, useState} from 'react';

import {Monitor, Snapshot} from '../types';

export function useMonitor(object: {[key: string]: any}, deps: any[]): Monitor {
  const id = useId();

  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [previous, setPrevious] = useState<Snapshot>(empty);
  const [current, setCurrent] = useState<Snapshot>(empty);
  const [recordSnapshot, setRecordSnapshotInternal] = useState(true);
  const count = useRef(0);

  const [isReady, setIsReady] = useState(false);

  const setRecordSnapshot = useCallback(
    (value: boolean) => {
      if (!isReady) {
        setIsReady(true);
      }
      setRecordSnapshotInternal(value);
    },
    [isReady],
  );

  useEffect(() => {
    if (!recordSnapshot || !isReady) return;

    const createdAt = Date.now().toString();

    const snapshot: Snapshot = {
      id: `object-${id}-${createdAt}`,
      createdAt,
      nodes: object,
      initial: count.current === 0,
    };

    setCurrent(snapshot);

    setSnapshots((prev) => [...prev, snapshot]);

    count.current++;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, isReady]);

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
      setRecordSnapshot,
    }),
    [clearSnapshots, current, previous, setRecordSnapshot, snapshots],
  );
}

const empty: Snapshot = {id: '0', createdAt: '', nodes: {}};

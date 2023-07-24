import {PropsWithChildren, useMemo} from 'react';

import {ReactStateContext} from '../../contexts';
import {Observer} from '../../types';

export function ReactDevTools({
  snapshot,
  snapshots,
  clearSnapshots,
  children,
  previous,
}: PropsWithChildren<Observer>) {
  const observer = useMemo(
    () => ({snapshots, snapshot, clearSnapshots, previous}),
    [clearSnapshots, previous, snapshot, snapshots],
  );

  return (
    <ReactStateContext.Provider value={observer}>
      {children}
    </ReactStateContext.Provider>
  );
}

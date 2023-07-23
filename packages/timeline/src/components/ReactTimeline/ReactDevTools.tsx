import {PropsWithChildren, useMemo} from 'react';

import {ReactStateContext} from '../../contexts';
import {Observer} from '../../types';

export function ReactDevTools({
  snapshot,
  snapshots,
  clearSnapshot,
  children,
}: PropsWithChildren<Observer>) {
  const observer = useMemo(
    () => ({snapshots, snapshot, clearSnapshot}),
    [clearSnapshot, snapshot, snapshots],
  );

  return (
    <ReactStateContext.Provider value={observer}>
      {children}
    </ReactStateContext.Provider>
  );
}

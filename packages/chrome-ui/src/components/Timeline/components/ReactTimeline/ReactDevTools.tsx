import {PropsWithChildren, useMemo} from 'react';

import {ReactStateContext} from '../../contexts';
import {Observer} from '../../types';

export function ReactDevTools({
  snapshot,
  snapshots,
  children,
}: PropsWithChildren<Observer>) {
  const observer = useMemo(
    () => ({snapshots, snapshot}),
    [snapshot, snapshots],
  );

  console.log({observer});

  return (
    <ReactStateContext.Provider value={observer}>
      {children}
    </ReactStateContext.Provider>
  );
}

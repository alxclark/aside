import React, {PropsWithChildren, useEffect, useState} from 'react';
import {Companion, DevTools as CompanionDevTools} from '@companion/react';
import {useRecoilSnapshot} from 'recoil';

import {Snapshot} from './types';
import {RemoteDevTools} from './remote';
import {isInternalAtom} from './utilities/recoil';

export function DevTools({children}: PropsWithChildren<{}>) {
  const recoilSnapshot = useRecoilSnapshot();
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [diffs, setDiffs] = useState<Snapshot[]>([]);

  useEffect(() => {
    const createdAt = new Date();

    const snapshot: Snapshot = {
      createdAt,
      nodes: {},
    };

    for (const node of recoilSnapshot.getNodes_UNSTABLE()) {
      if (isInternalAtom(node.key)) continue;
      snapshot.nodes[node.key] = recoilSnapshot.getLoadable(node).getValue();
    }

    const diff: Snapshot = {
      createdAt,
      nodes: {},
    };

    for (const node of recoilSnapshot.getNodes_UNSTABLE({isModified: true})) {
      if (isInternalAtom(node.key)) continue;
      diff.nodes[node.key] = recoilSnapshot.getLoadable(node).getValue();
    }

    setSnapshots((prev) => [...prev, snapshot]);
    setDiffs((prev) => [...prev, diff]);
  }, [recoilSnapshot]);

  return (
    <Companion>
      <CompanionDevTools>
        <RemoteDevTools api={{snapshots, diffs}} />
        {children}
      </CompanionDevTools>
    </Companion>
  );
}

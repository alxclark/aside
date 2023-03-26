import React, {PropsWithChildren, useEffect, useMemo, useState} from 'react';
import {Aside, DevTools as AsideDevTools} from '@aside/react';
import {useRecoilSnapshot} from 'recoil';

import {Snapshot} from './types';
import {RemoteDevTools} from './remote';
import {isInternalAtom} from './utilities/recoil';

export function DevTools({children}: PropsWithChildren<{}>) {
  const recoilSnapshot = useRecoilSnapshot();
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [diffs, setDiffs] = useState<Snapshot[]>([]);
  const api = useMemo(() => ({snapshots, diffs}), [diffs, snapshots]);

  useEffect(() => {
    const createdAt = new Date();

    const snapshot: Snapshot = {
      createdAt,
      nodes: {},
    };

    for (const node of recoilSnapshot.getNodes_UNSTABLE()) {
      if (isInternalAtom(node.key)) continue;

      const parts = node.key.split('__');
      const hasAtomFamilyPrefix = parts.length > 1;
      if (hasAtomFamilyPrefix) {
        const [prefix, ...rest] = parts;
        const itemKey = rest.join('').replaceAll('"', '');

        snapshot.nodes[prefix] ||= {};
        snapshot.nodes[prefix][itemKey] = recoilSnapshot
          .getLoadable(node)
          .getValue();
      } else {
        snapshot.nodes[node.key] = recoilSnapshot.getLoadable(node).getValue();
      }
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
    <Aside>
      <AsideDevTools>
        <RemoteDevTools api={api} />
        {children}
      </AsideDevTools>
    </Aside>
  );
}

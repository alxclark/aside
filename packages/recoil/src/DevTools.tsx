import React, {PropsWithChildren, useEffect, useState} from 'react';
import {
  Button,
  Companion,
  DevTools as CompanionDevTools,
  Navigation,
} from '@companion/react';
import {useRecoilSnapshot} from 'recoil';

import {DevToolsApi, PrimaryNavigation, Snapshot} from './types';
import {StateTree, StateDiffs} from './components';

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
      snapshot.nodes[node.key] = recoilSnapshot.getLoadable(node).getValue();
    }

    const diff: Snapshot = {
      createdAt,
      nodes: {},
    };

    for (const node of recoilSnapshot.getNodes_UNSTABLE({isModified: true})) {
      diff.nodes[node.key] = recoilSnapshot.getLoadable(node).getValue();
    }

    console.log({snapshot, diff});

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

function RemoteDevTools({api}: {api: DevToolsApi}) {
  const [tab, setTab] = useState<PrimaryNavigation>('state-tree');

  return (
    <Navigation>
      <Button onPress={() => setTab('state-tree')}>State tree</Button>
      <Button onPress={() => setTab('state-diff')}>State diffs</Button>
      {tab === 'state-tree' && (
        <StateTree currentState={api.snapshots[api.snapshots.length - 1]} />
      )}
      {tab === 'state-diff' && <StateDiffs diffs={api.diffs} />}
    </Navigation>
  );
}

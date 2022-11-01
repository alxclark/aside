import React, {PropsWithChildren, useEffect, useState} from 'react';
import {Companion, DevTools, List, ListItem} from '@companion/react';
import {useRecoilSnapshot, Snapshot} from 'recoil';

export function RecoilDevTools({children}: PropsWithChildren<{}>) {
  const [snapshots, setSnapshots] = useState<any[]>([]);
  const snapshot = useRecoilSnapshot();

  useEffect(() => {
    const persistedSnapshot: any = {
      createdAt: Date.now(),
      nodes: {},
    };

    for (const node of snapshot.getNodes_UNSTABLE()) {
      persistedSnapshot.nodes[node.key] = snapshot.getLoadable(node).getValue()
    }

    setSnapshots((prev) => [...prev, persistedSnapshot])
  }, [snapshot]);

  return (
    <Companion>
      <DevTools>
        <List>
          {snapshots.map((snapshot) => <ListItem key={snapshot.createdAt}>{snapshot.createdAt}: {JSON.stringify(snapshot.nodes)}</ListItem>)}
        </List>
      </DevTools>
    </Companion>
  )
}
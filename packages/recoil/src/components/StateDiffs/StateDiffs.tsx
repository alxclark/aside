import { ListItem, List } from '@companion/react';
import React from 'react';
import { Snapshot } from '../../types';

export function StateDiffs({diffs}: {diffs: Snapshot[]}) {

  return (
    <List>
      {diffs.map((diff) => <ListItem>{diff.createdAt.toLocaleTimeString()}: {JSON.stringify(diff.nodes)}</ListItem>)}
    </List>
  )
}
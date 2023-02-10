import {ListItem, List} from '@aside/react';
import React from 'react';

import {Snapshot} from '../../types';

export function StateDiffs({diffs}: {diffs: Snapshot[]}) {
  return (
    <List>
      {diffs.map((diff) => (
        <ListItem key={diff.createdAt.toISOString()}>
          {diff.createdAt.toLocaleTimeString()}: {JSON.stringify(diff.nodes)}
        </ListItem>
      ))}
    </List>
  );
}

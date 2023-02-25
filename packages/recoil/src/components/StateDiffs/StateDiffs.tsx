import {Table, TableRow, TableCell} from '@aside/react';
import React from 'react';

import {Snapshot} from '../../types';

export function StateDiffs({diffs}: {diffs: Snapshot[]}) {
  const columns = [{title: 'Name'}];

  // {JSON.stringify(diff.nodes)}

  return (
    <Table columns={columns}>
      {diffs.map((diff) => (
        <TableRow
          key={diff.createdAt.toISOString()}
          id={diff.createdAt.toISOString()}
        >
          <TableCell>{diff.createdAt.toLocaleTimeString()}</TableCell>
        </TableRow>
      ))}
    </Table>
  );
}

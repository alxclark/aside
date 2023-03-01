import {Table, TableRow, TableCell, Flex, View, Log} from '@aside/react';
import React, {useState} from 'react';

import {Snapshot} from '../../types';

export function StateDiffs({
  diffs,
  initial,
}: {
  diffs: Snapshot[];
  initial: Snapshot;
}) {
  const [selectedDiff, setSelectedDiff] = useState<number>(diffs.length - 1);

  return (
    <Flex fullHeight>
      <View width={150}>
        <Table
          onSelect={(index) => setSelectedDiff(parseInt(index, 10))}
          selected={selectedDiff.toString()}
          columns={[{title: 'Name', width: 30}]}
          border={false}
          scrollable
          maxHeight="calc(100vh - 55px)"
        >
          {diffs.map((diff, index) => (
            <TableRow key={diff.createdAt.toISOString()} id={index.toString()}>
              <TableCell>{getDiffName(diffs[index])}</TableCell>
            </TableRow>
          ))}
        </Table>
      </View>
      <View flexGrow border="left">
        <Log
          items={[
            {
              id: 'state',
              value:
                selectedDiff === 0 ? initial.nodes : diffs[selectedDiff].nodes,
            },
          ]}
        />
      </View>
    </Flex>
  );
}

function getDiffName(snapshot: Snapshot): string {
  if (Object.keys(snapshot.nodes).length === 0) return 'initial';

  return Object.keys(snapshot.nodes).join(', ');
}

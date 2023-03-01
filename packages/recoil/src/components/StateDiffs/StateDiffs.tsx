import {Table, TableRow, TableCell, Flex, View, Log} from '@aside/react';
import React, {useState} from 'react';

import {Snapshot} from '../../types';

export function StateDiffs({diffs}: {diffs: Snapshot[]}) {
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
          maxHeight="calc(100vh - 54px)"
        >
          {diffs.map((diff, index) => (
            <TableRow key={diff.createdAt.toISOString()} id={index.toString()}>
              <TableCell>{diff.createdAt.toLocaleTimeString()}</TableCell>
            </TableRow>
          ))}
        </Table>
      </View>
      <View flexGrow border="left">
        <Log items={[{id: 'state', value: diffs[selectedDiff].nodes}]} />
      </View>
    </Flex>
  );
}

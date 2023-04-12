import {
  Table,
  TableRow,
  TableCell,
  Flex,
  View,
  Log,
  Icon,
} from '@aside/chrome-ui';
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
        >
          {diffs.map((diff, index) => (
            <TableRow key={diff.createdAt.toISOString()} id={index.toString()}>
              <TableCell>
                <Flex gap="5px" alignItems="center">
                  {index === 0 ? (
                    <View margin="0 0 0 2px">
                      <Icon
                        source="start"
                        color={index === selectedDiff ? 'white' : '#2883ff'}
                        height={13}
                      />
                    </View>
                  ) : (
                    <View margin="0 0 0 1px">
                      <Icon
                        source="curly"
                        color={index === selectedDiff ? 'white' : '#e5ab04'}
                        height={15}
                      />
                    </View>
                  )}
                  {getDiffName(diffs[index])}
                </Flex>
              </TableCell>
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

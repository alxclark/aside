import {
  Table,
  TableRow,
  TableCell,
  Flex,
  View,
  Log,
  Icon,
  PaneToolbar,
  PaneToolbarSection,
  Button,
  PaneToolbarItem,
  Checkbox,
  TextField,
  PaneContent,
} from '@aside/chrome-ui';
import React, {useState} from 'react';
import {useRecoilState} from 'recoil';

import {
  filterAtom,
  preserveLogAtom,
  showFilterAtom,
} from '../../foundation/Timeline';
import {Snapshot} from '../../types';

export function StateDiffs({
  diffs,
  initial,
}: {
  diffs: Snapshot[];
  initial: Snapshot;
}) {
  const [selectedDiff, setSelectedDiff] = useState<number>(diffs.length - 1);
  const [showFilter, setShowFilter] = useRecoilState(showFilterAtom);
  const [preserveLog, setPreserveLog] = useRecoilState(preserveLogAtom);
  const [filter, setFilter] = useRecoilState(filterAtom);

  return (
    <>
      <PaneToolbar>
        <Flex justifyContent="space-between" alignItems="start">
          <Flex alignItems="center" wrap>
            <PaneToolbarSection>
              <Button
                icon="record-on"
                color="rgb(242, 139, 130)"
                title="Stop recording"
                iconHeight={19}
              />
              <Button
                icon="cancel"
                title="Clear"
                onPress={() => console.log('yo')}
              />
            </PaneToolbarSection>
            <PaneToolbarSection>
              <Button
                icon="filter"
                iconHeight={12}
                pressed={showFilter}
                title="Filter"
                onPress={() => setShowFilter((prev) => !prev)}
              />
            </PaneToolbarSection>
            <PaneToolbarSection>
              <PaneToolbarItem>
                <Checkbox
                  id="log"
                  label="Preserve log"
                  checked={preserveLog}
                  onChange={() => setPreserveLog((prev) => !prev)}
                />
              </PaneToolbarItem>
            </PaneToolbarSection>
          </Flex>
        </Flex>
      </PaneToolbar>
      {showFilter && (
        <PaneToolbar>
          <Flex alignItems="center" gap="4px" wrap>
            <View padding="3px 4px" width={163}>
              <TextField
                value={filter}
                onChange={setFilter}
                placeholder="Filter"
                id="filter"
              />
            </View>
          </Flex>
        </PaneToolbar>
      )}
      <PaneContent>
        <Flex fullHeight>
          <View maxHeight="100%" overflow="scroll" width={150}>
            <Table
              onSelect={(index) => setSelectedDiff(parseInt(index, 10))}
              selected={selectedDiff.toString()}
              columns={[{title: 'Name', width: 30}]}
              border={false}
              scrollable
              rowHeight="21px"
            >
              {diffs.map((diff, index) => (
                <TableRow
                  key={diff.createdAt.toISOString()}
                  id={index.toString()}
                >
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
                    selectedDiff === 0
                      ? initial.nodes
                      : diffs[selectedDiff].nodes,
                },
              ]}
            />
          </View>
        </Flex>
      </PaneContent>
    </>
  );
}

function getDiffName(snapshot: Snapshot): string {
  if (Object.keys(snapshot.nodes).length === 0) return 'initial';

  return Object.keys(snapshot.nodes).join(', ');
}

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
import {useRecoilState, useRecoilValue} from 'recoil';

import {
  diffsAtom,
  filterAtom,
  initialStateAtom,
  preserveLogAtom,
  showFilterAtom,
  Snapshot,
} from '../../foundation/Snapshots';

export function StateDiffs() {
  const [diffs, setDiffs] = useRecoilState(diffsAtom);
  const initial = useRecoilValue(initialStateAtom);

  const [selectedDiff, setSelectedDiff] = useState<string>(
    String(diffs[diffs.length - 1]?.id),
  );
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
                onPress={() => setDiffs([])}
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
              onSelect={(index) => setSelectedDiff(index)}
              selected={selectedDiff.toString()}
              columns={[{title: 'Name', width: 30}]}
              border={false}
              scrollable
              rowHeight="21px"
            >
              {diffs.map((diff, index) => (
                <TableRow
                  key={diff.createdAt.toISOString()}
                  id={String(diff.id)}
                >
                  <TableCell>
                    <Flex gap="5px" alignItems="center">
                      {diff.id === initial?.id ? (
                        <View margin="0 0 0 2px">
                          <Icon
                            source="start"
                            color={
                              String(diff.id) === selectedDiff
                                ? 'white'
                                : '#2883ff'
                            }
                            height={13}
                          />
                        </View>
                      ) : (
                        <View margin="0 0 0 1px">
                          <Icon
                            source="curly"
                            color={
                              String(diff.id) === selectedDiff
                                ? 'white'
                                : '#e5ab04'
                            }
                            height={15}
                          />
                        </View>
                      )}
                      {diff.id === initial?.id
                        ? 'initial'
                        : getDiffName(diffs[index])}
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
                  value: diffs.find((diff) => String(diff.id) === selectedDiff)
                    ?.nodes,
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
  return Object.keys(snapshot.nodes).join(', ');
}

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
  Text,
} from '@aside/chrome-ui';
import React from 'react';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';

import {
  diffsAtom,
  filterAtom,
  filteredDiffsAtom,
  invertFilterAtom,
  preserveLogAtom,
  recordSnapshotAtom,
  selectedDiffAtom,
  showFilterAtom,
  Snapshot,
  snapshotsAtom,
} from '../../foundation/Snapshots';

export function StateDiffs() {
  const unfilteredDiffs = useRecoilValue(diffsAtom);
  const diffs = useRecoilValue(filteredDiffsAtom);

  const setSnapshots = useSetRecoilState(snapshotsAtom);

  const [selectedDiff, setSelectedDiff] = useRecoilState(selectedDiffAtom);
  const [showFilter, setShowFilter] = useRecoilState(showFilterAtom);
  const [invertFilter, setinvertFilter] = useRecoilState(invertFilterAtom);
  const [preserveLog, setPreserveLog] = useRecoilState(preserveLogAtom);
  const [recordSnapshot, setRecordSnapshot] =
    useRecoilState(recordSnapshotAtom);
  const [filter, setFilter] = useRecoilState(filterAtom);

  const currentDiff = diffs.find((diff) => diff.id === selectedDiff);

  return (
    <>
      <PaneToolbar>
        <Flex justifyContent="space-between" alignItems="start">
          <Flex alignItems="center" wrap>
            <PaneToolbarSection>
              <Button
                icon={recordSnapshot ? 'record-on' : 'record-off'}
                alert={recordSnapshot}
                title="Stop recording"
                iconHeight={recordSnapshot ? 19 : 13}
                onPress={() => {
                  setRecordSnapshot((prev) => !prev);
                }}
              />
              <Button
                icon="cancel"
                title="Clear"
                onPress={() => {
                  setSelectedDiff(undefined);
                  // TODO
                  setSnapshots([]);
                }}
              />
            </PaneToolbarSection>
            <PaneToolbarSection>
              <Button
                icon="filter"
                iconHeight={12}
                alert={filter.length > 0}
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
            <Flex wrap gap="7px">
              <Checkbox
                id="invert"
                label="Invert"
                checked={invertFilter}
                onChange={() => setinvertFilter((prev) => !prev)}
              />
            </Flex>
          </Flex>
        </PaneToolbar>
      )}
      <PaneContent>
        {unfilteredDiffs.length > 0 ? (
          <Flex fullHeight direction="row">
            <View maxHeight="100%" overflow="scroll" minWidth={150}>
              <Table
                onSelect={(index) => setSelectedDiff(index)}
                selected={selectedDiff}
                columns={[{title: 'Name', width: 30}]}
                border={false}
                scrollable
                rowHeight="21px"
              >
                {diffs.map((diff, index) => (
                  <TableRow key={diff.id} id={diff.id}>
                    <TableCell>
                      <Flex gap="5px" alignItems="center">
                        {diff.initial ? (
                          <View margin="0 0 0 2px">
                            <Icon
                              source="start"
                              color={
                                diff.id === selectedDiff ? 'white' : '#2883ff'
                              }
                              height={13}
                            />
                          </View>
                        ) : (
                          <View margin="0 0 0 1px">
                            <Icon
                              source="curly"
                              color={
                                diff.id === selectedDiff ? 'white' : '#e5ab04'
                              }
                              height={15}
                            />
                          </View>
                        )}
                        {diff.initial ? 'initial' : getDiffName(diffs[index])}
                      </Flex>
                    </TableCell>
                  </TableRow>
                ))}
              </Table>
            </View>
            <View flexGrow border="left">
              {diffs.length > 0 && (
                <Log
                  items={[
                    {
                      id: 'state',
                      value: currentDiff?.nodes,
                    },
                  ]}
                  showDiffs={!currentDiff?.initial}
                />
              )}
            </View>
          </Flex>
        ) : (
          <EmptyView />
        )}
      </PaneContent>
    </>
  );
}

function EmptyView() {
  return (
    <Flex
      fullHeight
      justifyContent="center"
      alignItems="center"
      direction="column"
      gap="10px"
    >
      <Text>Recording activity...</Text>
      <Text>Perform an action or hit ⌘ R to record the reload.</Text>
    </Flex>
  );
}

function getDiffName(snapshot: Snapshot): string {
  return Object.keys(snapshot.nodes).join(', ');
}

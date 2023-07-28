import React, {createContext, useContext, useState} from 'react';
import {usePersistedState} from '@aside/react';
import {
  PaneToolbar,
  Flex,
  PaneToolbarSection,
  Button,
  PaneToolbarItem,
  Checkbox,
  View,
  TextField,
  PaneContent,
  Table,
  TableRow,
  TableCell,
  Image,
  Text,
} from '@aside/chrome-ui';

export interface Props {
  children: any;
  data: TimelineData[];
}

export interface TimelineItemData {
  id: string;
  createdAt: string;
  nodes: any;
}

export interface TimelineData<T extends TimelineItemData = TimelineItemData> {
  type: string;
  icon: string;
  rows: T[];
  name: (row: T) => string;
  query?: (row: T) => string;
  onDelete?: () => void;
}

export enum StorageKey {
  RecordSnapshot = 'record-snapshot',
  Filter = 'filter',
  ShowFilter = 'show-filter',
  PreserveLog = 'preserve-log',
  InvertFilter = 'invert-filter',
}

export function Timeline({children, data}: Props) {
  const [
    {data: recordSnapshot, loading: recordSnapshotLoading},
    setRecordSnapshot,
  ] = usePersistedState(true, {
    key: StorageKey.RecordSnapshot,
  });

  const [{data: filter, loading: filterLoading}, setFilter] = usePersistedState(
    '',
    {
      key: StorageKey.Filter,
    },
  );
  const [{data: showFilter, loading: showFilterLoading}, setShowFilter] =
    usePersistedState(true, {
      key: StorageKey.ShowFilter,
    });
  const [{data: preserveLog, loading: preserveLogLoading}, setPreserveLog] =
    usePersistedState(false, {
      key: StorageKey.PreserveLog,
    });
  const [{data: invertFilter, loading: invertFilterLoading}, setinvertFilter] =
    usePersistedState(false, {
      key: StorageKey.InvertFilter,
    });

  const rows = data
    .flatMap((column) =>
      column.rows.map((row, index) => ({...row, type: column.type, index})),
    )
    .sort((left, right) => {
      if (left.createdAt === right.createdAt) return 0;
      return left.createdAt < right.createdAt ? -1 : 1;
    });

  const getRow = (type: string) => data.find((group) => group.type === type);

  const filteredRows = rows.filter((row) => {
    const rowDescriptor = getRow(row.type);
    const query = rowDescriptor?.query?.(row) ?? rowDescriptor?.name(row);
    const isEmpty = Object.keys(row.nodes).length === 0;
    const included = query?.includes(filter ?? '');

    return (invertFilter ? !included : included) && !isEmpty;
  });

  const [selectedRow, setSelectedRow] = useState<string | undefined>(
    rows[0]?.id,
  );

  function handleClear() {
    data.forEach(({onDelete}) => onDelete?.());
    setSelectedRow(undefined);
  }

  if (
    recordSnapshotLoading ||
    filterLoading ||
    showFilterLoading ||
    preserveLogLoading ||
    invertFilterLoading
  ) {
    return null;
  }

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
              <Button icon="cancel" title="Clear" onPress={handleClear} />
            </PaneToolbarSection>
            <PaneToolbarSection>
              <Button
                icon="filter"
                iconHeight={12}
                alert={(filter ?? '').length > 0}
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
        {rows.length > 0 ? (
          <Flex fullHeight direction="row">
            <View
              maxHeight="100%"
              overflow="scroll"
              minWidth={150}
              maxWidth={150}
            >
              <Table
                onSelect={(rowId) => setSelectedRow(rowId)}
                selected={selectedRow}
                columns={[{title: 'Name', width: 30}]}
                border={false}
                scrollable
                rowHeight="21px"
              >
                {filteredRows.map((row) => (
                  <TableRow key={row.id} id={row.id}>
                    <TableCell>
                      <Flex gap="5px" alignItems="center">
                        <Image
                          source={getRow(row.type)?.icon ?? ''}
                          height={11}
                          filter={row.id === selectedRow ? 'grayscale' : 'none'}
                        />
                        {getRow(row.type)?.name(row)}
                      </Flex>
                    </TableCell>
                  </TableRow>
                ))}
              </Table>
            </View>
            <View flexGrow border="left">
              <TimelineItemContext.Provider value={selectedRow}>
                {children}
              </TimelineItemContext.Provider>
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

export const TimelineItemContext = createContext<string | undefined>(undefined);

export function useTimelineItem(): string | undefined {
  const item = useContext(TimelineItemContext);

  return item;
}

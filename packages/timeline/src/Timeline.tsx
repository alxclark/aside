import React, {PropsWithChildren, useCallback, useMemo, useState} from 'react';
import {useExtensionApi} from '@aside/react';
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
  SoftContextMenu,
  SoftContextMenuItem,
  Divider,
} from '@aside/chrome-ui';

import {TimelineData} from './types';
import {TimelineItemContext} from './contexts';
import {EmptyView} from './components';

export interface TimelineProps extends PropsWithChildren {
  data: TimelineData[];
}

export function Timeline({children, data}: TimelineProps) {
  const {timeline} = useExtensionApi();
  const [filter, setFilter] = timeline.filter;
  const [invertFilter, setInvertFilter] = timeline.invertFilter;
  const [showFilter, setShowFilter] = timeline.showFilter;
  const [preserveLog, setPreserveLog] = timeline.preserveLog;
  const [recordSnapshot, setRecordSnapshot] = timeline.recordSnapshot;
  const [showTimelineOptions, setShowTimelineOptions] =
    timeline.showTimelineOptions;
  const [showPreviousValues, setShowPreviousValues] =
    timeline.showPreviousValues;

  const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>(
    data.map((row) => row.type),
  );

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
    const included = query?.includes(filter.data ?? '');
    const isAcceptedType = selectedDataTypes.includes(row.type);

    return (
      (invertFilter.data ? !included : included) && !isEmpty && isAcceptedType
    );
  });

  const [explicitlySelectedRow, setSelectedRow] = useState<
    string | undefined
  >();

  const [showDataTypeMenu, setShowDataTypeMenu] = useState(false);

  const handleSelectedDataType = useCallback(
    (id: string) => {
      if (id === 'all') {
        console.log(rows.map((row) => row.type));
        setSelectedDataTypes(rows.map((row) => row.type));
      } else {
        setSelectedDataTypes((prev) => {
          if (prev.includes(id)) {
            return prev.filter((values) => values !== id);
          }

          return [...prev, id];
        });
      }
    },
    [rows],
  );

  const selectedRow = useMemo(() => {
    if (
      explicitlySelectedRow &&
      filteredRows.some((row) => row.id === explicitlySelectedRow)
    ) {
      return explicitlySelectedRow;
    }
    return filteredRows[filteredRows.length - 1]?.id;
  }, [explicitlySelectedRow, filteredRows]);

  function handleClear() {
    data.forEach(({onDelete}) => onDelete?.());
    setSelectedRow(undefined);
  }

  function getDataTypesText() {
    if (selectedDataTypes.length === rows.length) {
      return 'All types';
    }

    if (selectedDataTypes.length === 1) {
      return `${selectedDataTypes[0]} only`;
    }

    if (selectedDataTypes.length > 1) {
      return 'Custom types';
    }

    return 'Hide all';
  }

  if (
    recordSnapshot.loading ||
    filter.loading ||
    showFilter.loading ||
    preserveLog.loading ||
    invertFilter.loading
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
                alert={recordSnapshot.data}
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
                alert={filter.data.length > 0}
                pressed={showFilter.data}
                title="Filter"
                onPress={() => setShowFilter((prev) => !prev)}
              />
            </PaneToolbarSection>
            <PaneToolbarSection>
              <PaneToolbarItem>
                <Checkbox
                  id="log"
                  label="Preserve log"
                  checked={preserveLog.data}
                  onChange={() => setPreserveLog((prev) => !prev)}
                />
              </PaneToolbarItem>
            </PaneToolbarSection>
            <View position="relative">
              <Button
                disclosure
                onPress={() => setShowDataTypeMenu((prev) => !prev)}
              >
                {getDataTypesText()}
              </Button>
              {showDataTypeMenu && (
                <SoftContextMenu
                  selected={selectedDataTypes}
                  onPress={handleSelectedDataType}
                >
                  <SoftContextMenuItem id="all">All</SoftContextMenuItem>
                  <Divider horizontal />
                  {data.map(({type}) => (
                    <SoftContextMenuItem id={type} key={type}>
                      {type}
                    </SoftContextMenuItem>
                  ))}
                </SoftContextMenu>
              )}
            </View>
          </Flex>
          <PaneToolbarSection separatorBefore>
            <Button
              icon="cog"
              iconHeight={14}
              pressed={showTimelineOptions.data}
              onPress={() => setShowTimelineOptions((prev) => !prev)}
            />
          </PaneToolbarSection>
        </Flex>
      </PaneToolbar>
      {showFilter.data && (
        <>
          <PaneToolbar>
            <Flex alignItems="center" wrap justifyContent="space-between">
              <Flex alignItems="center" gap="4px" wrap>
                <View padding="3px 4px" width={163}>
                  <TextField
                    value={filter.data}
                    onChange={setFilter}
                    placeholder="Filter"
                    id="filter"
                  />
                </View>
                <Flex wrap gap="7px">
                  <Checkbox
                    id="invert"
                    label="Invert"
                    checked={invertFilter.data}
                    onChange={() => setInvertFilter((prev) => !prev)}
                  />
                </Flex>
              </Flex>
            </Flex>
          </PaneToolbar>
        </>
      )}
      {showTimelineOptions.data && (
        <PaneToolbar>
          <Flex>
            <View flexGrow>
              <PaneToolbarItem>
                <Checkbox
                  id="large-rows"
                  label="Show previous values"
                  onChange={() => setShowPreviousValues((prev) => !prev)}
                  checked={showPreviousValues.data}
                />
              </PaneToolbarItem>
            </View>
          </Flex>
        </PaneToolbar>
      )}
      <PaneContent>
        {filteredRows.length > 0 ? (
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
                          width={11}
                          filter={row.id === selectedRow ? 'grayscale' : 'none'}
                        />
                        {getRow(row.type)?.name(row)}
                      </Flex>
                    </TableCell>
                  </TableRow>
                ))}
              </Table>
            </View>
            <View
              flexGrow
              border="left"
              overflowWrap="break-word"
              overflow="hidden"
            >
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

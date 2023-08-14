/* eslint-disable no-nested-ternary */
import React, {PropsWithChildren, useCallback, useMemo, useState} from 'react';
import {useExtensionApi, useLocalStorageState} from '@aside/react';
import {
  Button,
  PaneToolbar,
  Flex,
  PaneToolbarSection,
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
  Icon,
} from '@aside/chrome-ui-remote';

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialDataTypes = useMemo(() => data.map((row) => row.type), []);

  const [{data: selectedDataTypes}, setSelectedDataTypes] =
    useLocalStorageState(initialDataTypes, {
      key: 'selected-data-types',
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
    [rows, setSelectedDataTypes],
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

    const row = getRow(selectedDataTypes[0]);
    if (selectedDataTypes.length === 1 && row) {
      return `${row.displayName} only`;
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
                title="Stop recording"
                size="icon"
                onClick={() => {
                  setRecordSnapshot((prev) => !prev);
                }}
              >
                <Icon
                  source={recordSnapshot.data ? 'record-on' : 'record-off'}
                  variant={recordSnapshot.data ? 'error' : 'default'}
                />
              </Button>
              <Button title="Clear" size="icon" onClick={handleClear}>
                <Icon source="cancel" />
              </Button>
            </PaneToolbarSection>
            <PaneToolbarSection>
              <Button
                size="icon"
                title="Filter"
                onClick={() => setShowFilter((prev) => !prev)}
              >
                <Icon
                  className="p-px"
                  source={showFilter.data ? 'filter-filled' : 'filter'}
                  variant={
                    filter.data.length > 0
                      ? 'error'
                      : showFilter.data
                      ? 'toggled'
                      : 'default'
                  }
                />
              </Button>
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
              <Button onClick={() => setShowDataTypeMenu((prev) => !prev)}>
                {getDataTypesText()}
              </Button>
              {showDataTypeMenu && (
                <SoftContextMenu
                  selected={selectedDataTypes}
                  onPress={handleSelectedDataType}
                >
                  <SoftContextMenuItem id="all">All</SoftContextMenuItem>
                  <Divider horizontal />
                  {data.map(({type, displayName}) => (
                    <SoftContextMenuItem id={type} key={type}>
                      {displayName}
                    </SoftContextMenuItem>
                  ))}
                </SoftContextMenu>
              )}
            </View>
          </Flex>
          <PaneToolbarSection separatorBefore>
            <Button
              size="icon"
              onClick={() => setShowTimelineOptions((prev) => !prev)}
            >
              <Icon
                source={showTimelineOptions.data ? 'cog-filled' : 'cog'}
                variant={showTimelineOptions.data ? 'toggled' : 'default'}
              />
            </Button>
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

/* eslint-disable no-nested-ternary */
import React, {PropsWithChildren, useCallback, useMemo, useState} from 'react';
import {useExtensionApi, useLocalStorageState} from '@aside/react';
import {
  Button,
  PaneToolbar,
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
  Icon,
  Carret,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@aside/chrome-ui-remote';

import {ActivityItemContext} from './contexts';
import {EmptyView} from './components';
import {useActivity} from './hooks/use-activity';
import {ActivityStore, Snapshot} from './types';

export interface ActivityProps extends PropsWithChildren {}

export function Activity({children}: ActivityProps) {
  const activity = useActivity();

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

  const initialDataTypes = useMemo(
    () => activity.map((row) => row.data.type),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [{data: selectedDataTypes}, setSelectedDataTypes] =
    useLocalStorageState(initialDataTypes, {
      key: 'selected-data-types',
    });

  const rows = activity
    .flatMap((column) =>
      column.data.rows.map((row, index) => ({
        ...row,
        type: column.data.type,
        index,
      })),
    )
    .sort((left, right) => {
      if (left.createdAt === right.createdAt) return 0;
      return left.createdAt < right.createdAt ? -1 : 1;
    });

  const getRow = (type: string) =>
    activity.find((store) => store.data.type === type);

  const filteredRows = rows.filter((row) => {
    const rowDescriptor = getRow(row.type)?.data;
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

  const handleSelectedDataType = useCallback(
    (id: string) => {
      if (id === 'all') {
        const allSelected = activity.length === selectedDataTypes.length;
        if (allSelected) {
          setSelectedDataTypes([]);
        } else {
          setSelectedDataTypes(activity.map((row) => row.data.type));
        }
      } else {
        setSelectedDataTypes((prev) => {
          if (prev.includes(id)) {
            return prev.filter((values) => values !== id);
          }

          return [...prev, id];
        });
      }
    },
    [activity, selectedDataTypes.length, setSelectedDataTypes],
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
    activity.forEach(({data: {onDelete}}) => onDelete?.());
    setSelectedRow(undefined);
  }

  function getDataTypesText() {
    if (selectedDataTypes.length === activity.length) {
      return 'All types';
    }

    const row = getRow(selectedDataTypes[0])?.data;
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
        <View className="flex justify-between items-start">
          <View className="flex items-center flex-wrap">
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
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button>
                  {getDataTypesText()}
                  <Carret className="ml-1" direction="down" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuCheckboxItem
                  checked={selectedDataTypes.length === activity.length}
                  onCheckedChange={() => handleSelectedDataType('all')}
                >
                  All
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                {activity.map(({data: {type, displayName}}) => (
                  <DropdownMenuCheckboxItem
                    checked={selectedDataTypes.includes(type)}
                    onCheckedChange={() => handleSelectedDataType(type)}
                    key={type}
                  >
                    {displayName}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </View>
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
        </View>
      </PaneToolbar>
      {showFilter.data && (
        <>
          <PaneToolbar>
            <View className="flex items-center flex-wrap justify-between">
              <View className="flex items-center gap-2 flex-wrap">
                <View className="w-52 p-0.5">
                  <TextField
                    value={filter.data}
                    onChange={setFilter}
                    placeholder="Filter"
                    id="filter"
                  />
                </View>

                <Checkbox
                  id="invert"
                  label="Invert"
                  checked={invertFilter.data}
                  onChange={() => setInvertFilter((prev) => !prev)}
                />
              </View>
            </View>
          </PaneToolbar>
        </>
      )}
      {showTimelineOptions.data && (
        <PaneToolbar>
          <View className="flex">
            <View className="grow">
              <PaneToolbarItem>
                <Checkbox
                  id="large-rows"
                  label="Show previous values"
                  onChange={() => setShowPreviousValues((prev) => !prev)}
                  checked={showPreviousValues.data}
                />
              </PaneToolbarItem>
            </View>
          </View>
        </PaneToolbar>
      )}
      <PaneContent>
        {filteredRows.length > 0 ? (
          <View className="flex h-full">
            <View className="max-h-full overflow-scroll w-52 shrink-0 relative">
              <Table
                onSelect={(rowId) => setSelectedRow(rowId)}
                selected={selectedRow}
                columns={[{title: 'Name', width: 30}]}
                scrollable
                rowHeight="21px"
                className="absolute"
              >
                {filteredRows.map((row) => (
                  <ActivityRow
                    row={row}
                    column={getRow(row.type)}
                    key={row.id}
                    selectedRow={selectedRow}
                  />
                ))}
              </Table>
            </View>
            <View className="grow border-l-2 border-border break-words overflow-hidden">
              <ActivityItemContext.Provider value={selectedRow}>
                {children}
              </ActivityItemContext.Provider>
            </View>
          </View>
        ) : (
          <EmptyView />
        )}
      </PaneContent>
    </>
  );
}

type ActivityRowType = Snapshot & {
  type: string;
  index: number;
};

function ActivityRow({
  row,
  column,
  selectedRow,
}: {
  row: ActivityRowType;
  column?: ActivityStore;
  selectedRow?: string;
}) {
  function renderIcon() {
    if (!column?.data.icon) {
      return <Icon source="cancel" size="sm" variant="subdued" />;
    }

    const computedIcon =
      typeof column.data.icon === 'function'
        ? column.data.icon(row)
        : column.data.icon;

    if (typeof computedIcon === 'string') {
      return (
        <Image
          source={computedIcon}
          height={11}
          width={11}
          filter={row.id === selectedRow ? 'grayscale' : 'none'}
        />
      );
    }

    return (
      <Icon
        source={computedIcon.source}
        variant={computedIcon.variant}
        size="md"
        className={
          row.id === selectedRow
            ? 'brightness-0 invert'
            : 'brightness-100 invert-1'
        }
      />
    );
  }

  return (
    <TableRow key={row.id} id={row.id}>
      <TableCell>
        <View className="flex gap-1.5 items-center pl-0.5">
          {renderIcon()}
          {column?.data.name(row)}
        </View>
      </TableCell>
    </TableRow>
  );
}

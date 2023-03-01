import classNames from 'classnames';
import React, {PropsWithChildren, useMemo, useState} from 'react';

import {TableContext} from './context';

export type Props = PropsWithChildren<{
  columns: Column[];
  onSelect?(rowId: string): void;
  border?: boolean;
  scrollable?: boolean;
  maxHeight?: string;
}>;

export interface Column {
  title: string;
  /**
   * Initial width of the column.
   */
  width?: number;
  onSort?(direction: SortDirection): void;
}

export type SortDirection = 'ascending' | 'descending';

export function Table({
  columns,
  children,
  onSelect,
  border = true,
  scrollable,
  maxHeight,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | undefined>();

  const headings = columns.map(({title, width}) => (
    <th
      className={classNames(
        'px-1 py-1 font-normal text-gray-200 text-left border-gray-400 truncate hover:bg-[#454545]',
        border && 'border-x',
      )}
      style={{maxWidth: width, width}}
      key={title}
    >
      {title}
    </th>
  ));

  const tableContext: TableContext = useMemo(
    () => ({
      selectedId,
      setSelectedId: (id: string) => {
        setSelectedId(id);
        onSelect?.(id);
      },
      border,
    }),
    [selectedId, border, onSelect],
  );

  return (
    <TableContext.Provider value={tableContext}>
      <table
        className={classNames(
          'w-full border-collapse border-gray-400',
          border && 'border-b',
        )}
      >
        <thead
          className={classNames(
            'bg-gray-500 w-full border-gray-400',
            border ? 'border' : 'border-y',
          )}
        >
          <tr>{headings}</tr>
        </thead>
        <tbody
          style={{maxHeight}}
          className={classNames(scrollable && 'overflow-scroll', 'block')}
        >
          {children}
        </tbody>
      </table>
    </TableContext.Provider>
  );
}

// max-height: calc(100vh - 54px);
//     display: block;
//     overflow: scroll;

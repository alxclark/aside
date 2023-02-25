import React, {PropsWithChildren, useMemo, useState} from 'react';

import {TableContext} from './context';

export type Props = PropsWithChildren<{
  columns: Column[];
  onSelect?(rowId: string): void;
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

export function Table({columns, children, onSelect}: Props) {
  const [selectedId, setSelectedId] = useState<string | undefined>();

  const headings = columns.map(({title, width}) => (
    <th
      className="px-1 py-1 font-normal text-gray-200 text-left border-gray-400 border truncate hover:bg-[#454545]"
      style={{maxWidth: width, width}}
      key={title}
    >
      {title}
    </th>
  ));

  const tableContext: TableContext = useMemo(
    () => ({
      selectedId,
      setSelectedId,
    }),
    [selectedId],
  );

  return (
    <TableContext.Provider value={tableContext}>
      <table className="w-full border-collapse border-b border-gray-400">
        <thead className="bg-gray-500 w-full border-gray-400 border">
          <tr>{headings}</tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </TableContext.Provider>
  );
}

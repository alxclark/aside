import classNames from 'classnames';
import React, {
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {TableContext} from './context';

export type Props = PropsWithChildren<{
  columns: Column[];
  onSelect?(rowId: string): void;
  selected?: string;
  border?: boolean;
  scrollable?: boolean;
  maxHeight?: string;
  rowHeight?: string;
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
  selected,
  rowHeight,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | undefined>(selected);
  const tablebodyRef = useRef<HTMLTableSectionElement | null>(null);

  useEffect(() => {
    if (scrollable && tablebodyRef.current) {
      tablebodyRef.current.scrollTo({top: tablebodyRef.current.scrollHeight});
    }
  }, [scrollable]);

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
      rowHeight,
    }),
    [selectedId, border, onSelect, rowHeight],
  );

  return (
    <TableContext.Provider value={tableContext}>
      <table
        className={classNames('w-full border-collapse border-gray-400 h-full')}
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
          ref={tablebodyRef}
          style={{maxHeight}}
          className={classNames(scrollable && 'overflow-scroll')}
        >
          {children}
          <tr>
            {headings.map(() => (
              <td
                className={classNames('border-gray-400', border && 'border-x')}
              />
            ))}
          </tr>
        </tbody>
      </table>
    </TableContext.Provider>
  );
}

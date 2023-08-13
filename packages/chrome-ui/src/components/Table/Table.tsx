import classNames from 'classnames';
import React, {useEffect, useMemo, useRef} from 'react';
import {TableProps} from '@aside/chrome-ui-remote';

import {TableContext} from './context';

export function Table({
  columns,
  children,
  onSelect,
  border = true,
  scrollable,
  selected,
  rowHeight,
}: TableProps) {
  const tablebodyRef = useRef<HTMLTableSectionElement | null>(null);

  useEffect(() => {
    if (scrollable && tablebodyRef.current) {
      tablebodyRef.current.scrollTo({top: tablebodyRef.current.scrollHeight});
    }
  }, [scrollable, selected]);

  const headings = columns.map(({title, width}) => (
    <th
      className={classNames(
        'px-1 py-1 font-normal text-gray-200 text-left border-gray-400 truncate hover:bg-grid-hover',
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
      selectedId: selected,
      setSelectedId: (id: string) => {
        onSelect?.(id);
      },
      border,
      rowHeight,
    }),
    [selected, border, rowHeight, onSelect],
  );

  return (
    <TableContext.Provider value={tableContext}>
      <table
        className={classNames('w-full border-collapse border-gray-400 h-full')}
      >
        <thead
          className={classNames(
            'bg-gray-500 w-full sticky top-0 z-10',
            'shadow-table',
          )}
        >
          <tr>{headings}</tr>
        </thead>
        <tbody
          ref={tablebodyRef}
          className={classNames(scrollable && 'overflow-scroll')}
        >
          {children}
          <tr>
            {columns.map(({title}) => (
              <td
                key={title}
                className={classNames('border-gray-400', border && 'border-x')}
              />
            ))}
          </tr>
        </tbody>
      </table>
    </TableContext.Provider>
  );
}

import classNames from 'classnames';
import React, {useEffect, useMemo, useRef} from 'react';
import {TableProps} from '@aside/chrome-ui-remote';

import {TableContext} from './context';

export type {TableProps};

export function Table({
  columns,
  children,
  onSelect,
  border = false,
  scrollable,
  selected,
  rowHeight,
  className,
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
        'px-1 py-1 font-normal text-foreground text-left border-border truncate hover:bg-muted',
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
        className={classNames(
          'w-full border-collapse border-border',
          className,
        )}
      >
        <thead
          className={classNames(
            'bg-grid-head w-full sticky top-0 z-10',
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
                className={classNames('border-border', border && 'border-x')}
              />
            ))}
          </tr>
        </tbody>
      </table>
    </TableContext.Provider>
  );
}

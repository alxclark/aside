import React, {useEffect, useRef} from 'react';
import classNames from 'classnames';
import {TableRowProps} from '@aside/chrome-ui-remote';

import {useTable} from '../hooks';

export type {TableRowProps};

export function TableRow({children, id}: TableRowProps) {
  const {selectedId, setSelectedId, rowHeight} = useTable();
  const rowRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    if (selectedId === id) {
      rowRef.current?.scrollIntoView({behavior: 'smooth', block: 'nearest'});
    }
  }, [id, selectedId]);

  return (
    <tr
      ref={rowRef}
      style={{height: rowHeight}}
      className={classNames(
        'bg-grid-odd text-gray-200',
        selectedId === id
          ? 'bg-grid-selected'
          : 'even:bg-grid-even hover:bg-grid-hover',
      )}
      onClick={() => setSelectedId(id)}
    >
      {children}
    </tr>
  );
}

import classNames from 'classnames';
import React from 'react';
import {TableCellProps} from '@aside/chrome-ui-remote';

import {useTable} from '../hooks';

export type {TableCellProps};

export function TableCell({children}: TableCellProps) {
  const {border} = useTable();

  return (
    <td
      className={classNames(
        'border-gray-400 px-1 truncate',
        border && 'border-x',
      )}
    >
      {children}
    </td>
  );
}

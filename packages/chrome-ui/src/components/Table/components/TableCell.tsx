import classNames from 'classnames';
import React from 'react';

import {useTable} from '../hooks';

export interface Props {
  children?: React.ReactNode;
}

export function TableCell({children}: Props) {
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

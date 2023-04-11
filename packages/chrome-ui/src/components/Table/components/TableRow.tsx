import React from 'react';
import classNames from 'classnames';

import {useTable} from '../hooks';

export interface Props {
  children: React.ReactNode;
  id: string;
}

export function TableRow({children, id}: Props) {
  const {selectedId, setSelectedId, rowHeight} = useTable();

  return (
    <tr
      style={{height: rowHeight}}
      className={classNames(
        'bg-[#292929] text-gray-200',
        selectedId === id
          ? 'bg-[#10639d]'
          : 'even:bg-[#232323] hover:bg-[#172436]',
      )}
      onClick={() => setSelectedId(id)}
    >
      {children}
    </tr>
  );
}

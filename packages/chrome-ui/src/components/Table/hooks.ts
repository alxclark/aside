import {useContext} from 'react';

import {TableContext} from './context';

export function useTable() {
  const table = useContext(TableContext);

  if (!table) {
    throw new Error('There is no TableContext available in context.');
  }

  return table;
}

import {createRemoteReactComponent} from '@remote-ui/react';
import {TableProps, TableRowProps, TableCellProps} from '@aside/chrome-ui';

export const Table = createRemoteReactComponent<'Table', TableProps>('Table');
export const TableRow = createRemoteReactComponent<'TableRow', TableRowProps>(
  'TableRow',
);
export const TableCell = createRemoteReactComponent<
  'TableCell',
  TableCellProps
>('TableCell');

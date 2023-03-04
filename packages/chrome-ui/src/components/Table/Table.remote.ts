import {createRemoteReactComponent} from '@remote-ui/react';

import type {Props} from './Table';
import type {TableRowProps, TableCellProps} from './components';

export const Table = createRemoteReactComponent<'ChromeUITable', Props>(
  'ChromeUITable',
);

export const TableRow = createRemoteReactComponent<
  'ChromeUITableRow',
  TableRowProps
>('ChromeUITableRow');

export const TableCell = createRemoteReactComponent<
  'ChromeUITableCell',
  TableCellProps
>('ChromeUITableCell');

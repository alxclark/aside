import {createRemoteReactComponent} from '@remote-ui/react';
import {PropsWithChildren} from 'react';

export type TableProps = PropsWithChildren<{
  columns: Column[];
  onSelect?(rowId: string): void;
  selected?: string;
  border?: boolean;
  scrollable?: boolean;
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

export const Table = createRemoteReactComponent<'ChromeUITable', TableProps>(
  'ChromeUITable',
);

export type TableRowProps = PropsWithChildren<{id: string}>;

export const TableRow = createRemoteReactComponent<
  'ChromeUITableRow',
  TableRowProps
>('ChromeUITableRow');

export type TableCellProps = PropsWithChildren;

export const TableCell = createRemoteReactComponent<
  'ChromeUITableCell',
  TableCellProps
>('ChromeUITableCell');

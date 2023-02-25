import React, {PropsWithChildren} from 'react';

export type Props = PropsWithChildren<{
  columns: Column[];
  onSelect?(rowId: string): void;
}>;

export interface Column {
  title: string;
  onSort?(direction: SortDirection): void;
}

export type SortDirection = 'ascending' | 'descending';

export function Table({columns, children, onSelect}: Props) {
  const headings = columns.map(({title}) => <th key={title}>{title}</th>);

  return (
    <table>
      <thead>
        <tr>{headings}</tr>
      </thead>
      <tbody />
    </table>
  );
}

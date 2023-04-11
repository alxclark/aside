import {createContext} from 'react';

export interface TableContext {
  selectedId?: string;
  setSelectedId(id?: string): void;
  border: boolean;
  rowHeight?: string;
}

export const TableContext = createContext<TableContext | undefined>(undefined);

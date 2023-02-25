import {createContext} from 'react';

export interface TableContext {
  selectedId?: string;
  setSelectedId(id?: string): void;
}

export const TableContext = createContext<TableContext | undefined>(undefined);

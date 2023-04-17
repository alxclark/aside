import type {Diff as DiffNodes} from '@aside/chrome-ui/react';

export {DiffNodes};

export interface Snapshot {
  id: string;
  createdAt: string;
  nodes: {[key: string]: any};
  initial?: boolean;
}

export interface Diff {
  id: string;
  createdAt: string;
  nodes: DiffNodes;
  initial?: boolean;
}

export interface Snapshot {
  id: string;
  createdAt: string;
  nodes: {[key: string]: any};
  initial?: boolean;
}

export interface DiffNode {
  [key: string]: {
    previous?: DiffNode | string | boolean | any[] | null | undefined;
    next: DiffNode | string | boolean | any[] | null | undefined;
  };
}

export interface Diff {
  id: string;
  createdAt: string;
  nodes: DiffNode;
  initial?: boolean;
}

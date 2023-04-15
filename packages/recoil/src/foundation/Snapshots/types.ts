export interface Snapshot {
  id: string;
  createdAt: string;
  nodes: {[key: string]: any};
  initial?: boolean;
}

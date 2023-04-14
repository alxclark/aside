export interface Snapshot {
  id: string;
  createdAt: Date;
  nodes: {[key: string]: any};
}

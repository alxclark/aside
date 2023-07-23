export interface Snapshot {
  id: string;
  createdAt: string;
  nodes: {[key: string]: any};
}

export interface Observer {
  snapshots: Snapshot[];
  snapshot: Snapshot;
}

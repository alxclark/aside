export interface Snapshot {
  id: string;
  createdAt: string;
  nodes: {[key: string]: any};
}

export interface Observer {
  previous?: Snapshot;
  snapshots: Snapshot[];
  snapshot: Snapshot;
  clearSnapshots?: () => void;
}

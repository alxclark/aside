export interface Snapshot {
  id: string;
  createdAt: string;
  nodes: {[key: string]: any};
  initial?: boolean;
}

export interface Observer {
  previous?: Snapshot;
  snapshots: Snapshot[];
  snapshot: Snapshot;
  clearSnapshots?: () => void;
}

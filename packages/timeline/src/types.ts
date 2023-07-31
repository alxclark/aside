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
  setRecordSnapshot?: (value: boolean) => void;
}

export interface DataStore {
  data: TimelineData;
  observer: Observer;
}

export interface DataStoreDescriptor {
  type: string;
  icon?: string;
  observer: Observer;
}

export interface TimelineData<T extends Snapshot = Snapshot> {
  type: string;
  icon: string;
  rows: T[];
  name: (row: T) => string;
  query?: (row: T) => string;
  onDelete?: () => void;
}

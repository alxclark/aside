export interface Snapshot {
  createdAt: Date;
  nodes: {[key: string]: any};
}

export interface DevToolsApi {
  snapshots: Snapshot[];
  diffs: Snapshot[];
}

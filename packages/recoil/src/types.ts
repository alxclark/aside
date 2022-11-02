export interface Snapshot {
  createdAt: Date;
  nodes: Record<string, any>
}

export type PrimaryNavigation = 'state-tree' | 'state-diff'

export interface DevToolsApi {
  snapshots: Snapshot[];
  diffs: Snapshot[];
}
import {IconProps} from '@aside/chrome-ui-remote';

export interface Snapshot<T = {[key: string]: any}> {
  id: string;
  createdAt: string;
  nodes: T;
  initial?: boolean;
}

export interface Monitor {
  previous?: Snapshot;
  snapshots: Snapshot[];
  snapshot: Snapshot;
  clearSnapshots?: () => void;
  setRecordSnapshot?: (value: boolean) => void;
  skipDiffing?: boolean;
}

export interface ActivityStore {
  data: ActivityData;
  monitor: Monitor;
}

export interface ActivityStoreDescriptor<T extends Snapshot = Snapshot> {
  type: string;
  displayName: string;
  rowName?: (row: T) => string;
  icon?:
    | ((row: T) => Pick<IconProps, 'source' | 'variant'> | `https://${string}`)
    | Pick<IconProps, 'source' | 'variant'>
    | `https://${string}`;
  monitor: Monitor;
}

export interface ActivityData<T extends Snapshot = Snapshot> {
  type: string;
  displayName: string;
  icon?:
    | ((row: T) => Pick<IconProps, 'source' | 'variant'> | `https://${string}`)
    | Pick<IconProps, 'source' | 'variant'>
    | `https://${string}`;
  rows: T[];
  name: (row: T) => string;
  query?: (row: T) => string;
  onDelete?: () => void;
}

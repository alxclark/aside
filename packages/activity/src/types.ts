import {IconProps} from '@aside/chrome-ui-remote';
import {ActivityApi} from '@aside/core';

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
  /**
   * Whether to diff successive snapshots.
   * Defaults to false.
   */
  diff?: boolean;
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
    | ((row: T) => Pick<IconProps, 'source' | 'variant'> | string)
    | Pick<IconProps, 'source' | 'variant'>
    | string;
  monitor: Monitor;
}

export interface ActivityData<T extends Snapshot = Snapshot> {
  type: string;
  displayName: string;
  icon?:
    | ((row: T) => Pick<IconProps, 'source' | 'variant'> | string)
    | Pick<IconProps, 'source' | 'variant'>
    | string;
  rows: T[];
  name: (row: T) => string;
  query?: (row: T) => string;
  onDelete?: () => void;
}

export interface ActivityContext extends ActivityApi {
  stores: ActivityStore[];
}

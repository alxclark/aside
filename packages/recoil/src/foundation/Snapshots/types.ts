import {SnapshotID} from 'recoil';

export interface Snapshot {
  id: SnapshotID;
  createdAt: Date;
  nodes: {[key: string]: any};
}

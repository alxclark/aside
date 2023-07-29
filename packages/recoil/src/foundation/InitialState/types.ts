import {PrimaryNavigation} from '../Navigation';
import {Snapshot} from '../Snapshots';

export interface PersistedState {
  snapshots?: Snapshot[];
  primaryNavigation?: PrimaryNavigation;
}

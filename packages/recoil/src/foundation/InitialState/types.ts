import {PrimaryNavigation} from '../Navigation';
import {Snapshot} from '../Snapshots';

export interface PersistedState {
  filter?: string;
  showFilter?: boolean;
  preserveLog?: boolean;
  recordSnapshot?: boolean;
  diffs?: Snapshot[];
  selectedDiff?: string;
  primaryNavigation?: PrimaryNavigation;
}

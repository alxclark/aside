import {atom} from 'recoil';

import {createKey} from '../../utilities/recoil';
import {syncStorageEffect} from '../Extension';

import {PrimaryNavigation, PrimaryNavigationTab} from './types';

export const primaryNavigationAtom = atom<PrimaryNavigation>({
  key: createKey('primaryNavigation'),
  default: {
    tab: PrimaryNavigationTab.StateTree,
  },
  effects: [syncStorageEffect()],
});

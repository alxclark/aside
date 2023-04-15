import {atom, AtomEffect} from 'recoil';

import {createKey} from '../../utilities/recoil';
import {extensionApiAtom, syncStorageEffect} from '../Extension';

import {PrimaryNavigation, PrimaryNavigationTab} from './types';

export const primaryNavigationAtom = atom<PrimaryNavigation>({
  key: createKey('primaryNavigation'),
  default: {
    tab: PrimaryNavigationTab.StateTree,
  },
  effects: [syncStorageEffect],
});

import {atom} from 'recoil';

import {PrimaryNavigation, PrimaryNavigationTab} from './types';

export const primaryNavigationAtom = atom<PrimaryNavigation>({
  key: 'primaryNavigation',
  default: {
    tab: PrimaryNavigationTab.StateTree,
  },
});

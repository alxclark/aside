import {atom} from 'recoil';

import {createKey} from '../../utilities/recoil';

export const filterAtom = atom<string>({
  key: createKey('filter'),
  default: '',
});

export const showFilterAtom = atom<boolean>({
  key: createKey('show-filter'),
  default: false,
});

export const preserveLogAtom = atom<boolean>({
  key: createKey('preserve-log'),
  default: false,
});

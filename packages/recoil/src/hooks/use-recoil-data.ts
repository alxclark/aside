import {useRecoilValue} from 'recoil';
import {TimelineData} from '@aside/chrome-ui';
import {useMemo} from 'react';

import {diffsAtom} from '../foundation/Snapshots';
// eslint-disable-next-line @shopify/strict-component-boundaries
import {Diff} from '../foundation/Snapshots/types';

export interface RecoilData extends TimelineData<Diff> {
  type: 'recoil';
}

export function useRecoilData(): RecoilData {
  const diffs = useRecoilValue(diffsAtom);

  return useMemo(
    () => ({
      type: 'recoil',
      icon: 'https://recoiljs.org/img/favicon.png',
      rows: diffs,
      name: (diff) => Object.keys(diff.nodes).join(', '),
      query: (diff) => Object.keys(diff.nodes).join(', '),
    }),
    [diffs],
  );
}

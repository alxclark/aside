/* eslint-disable @shopify/strict-component-boundaries */
import {PropsWithChildren} from 'react';

import {Log} from '../../../Log/Log.remote';
import {useTimelineItem} from '../../Timeline';

import {useReactData} from './hooks';

export function ReactTimeline({children}: PropsWithChildren) {
  const selected = useTimelineItem();
  const {rows} = useReactData();

  if (!selected) return null;

  const matchingRow = rows.find((row) => row.id === selected);

  if (!matchingRow) return null;

  return (
    <>
      <Log
        items={[
          {
            id: 'state',
            value: matchingRow.nodes,
          },
        ]}
        showDiffs
      />
      {children}
    </>
  );
}

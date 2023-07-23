import {Log} from '@aside/chrome-ui';
import React from 'react';
import {useTimelineItem} from '@aside/timeline';

import {useRecoilData} from '../../hooks';

export interface Props {
  children?: React.ReactNode;
}

export function RecoilTimeline({children}: Props) {
  const selected = useTimelineItem();
  const {rows} = useRecoilData();

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

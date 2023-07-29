import React from 'react';
import {Log} from '@aside/chrome-ui';
import {useTimelineItem} from '@aside/timeline';
import {useExtensionApi} from '@aside/react';

import {useRecoilData} from '../../hooks';

export interface Props {
  children?: React.ReactNode;
}

export function RecoilTimeline({children}: Props) {
  const api = useExtensionApi();
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
        showDiffs={api.timeline.showPreviousValues[0].data}
      />
      {children}
    </>
  );
}

import React, {PropsWithChildren} from 'react';
import {Log} from '@aside/chrome-ui';
import {useExtensionApi} from '@aside/react';

import {useTimelineItem} from '../../Timeline';

import {useReactData} from './hooks';

export function ReactTimeline({children}: PropsWithChildren) {
  const api = useExtensionApi();
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
        showDiffs={api.timeline.showPreviousValues[0].data}
      />
      {children}
    </>
  );
}

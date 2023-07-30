import React, {PropsWithChildren} from 'react';
import {Log} from '@aside/chrome-ui';
import {useExtensionApi} from '@aside/react';

import {useTimelineItem, useDataStore} from '../hooks';

export function TimelineDetails({
  children,
  type,
}: PropsWithChildren<{type: string}>) {
  const api = useExtensionApi();
  const selected = useTimelineItem();
  const {rows} = useDataStore(type).data;

  if (!selected) return null;

  const matchingRow = rows.find((row) => row.id === selected);

  if (!matchingRow) return null;

  return (
    <>
      <Log
        items={[
          {
            id: type,
            value: matchingRow.nodes,
          },
        ]}
        showDiffs={api.timeline.showPreviousValues[0].data}
      />
      {children}
    </>
  );
}

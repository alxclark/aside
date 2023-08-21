import React, {PropsWithChildren} from 'react';
import {ConsoleMessage} from '@aside/chrome-ui-remote';
import {useExtensionApi} from '@aside/react';

import {useActivityItem, useDataStore} from '../hooks';

export function ActivityDetails({
  children,
  type,
}: PropsWithChildren<{type: string}>) {
  const api = useExtensionApi();
  const selected = useActivityItem();
  const {rows} = useDataStore(type).data;

  if (!selected) return null;

  const matchingRow = rows.find((row) => row.id === selected);

  if (!matchingRow) return null;

  return (
    <>
      <ConsoleMessage
        value={matchingRow.nodes}
        showPreviousValues={api.timeline.showPreviousValues[0].data}
      />
      {children}
    </>
  );
}

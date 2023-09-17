import React, {PropsWithChildren} from 'react';
import {ConsoleMessage} from '@aside/chrome-ui-remote';

import {useActivityItem, useActivityStore, useActivity} from '../hooks';

export function ActivityDetails({
  children,
  type,
}: PropsWithChildren<{type: string}>) {
  const {showPreviousValues} = useActivity();
  const selected = useActivityItem();
  const {rows} = useActivityStore(type).data;

  if (!selected) return null;

  const matchingRow = rows.find((row) => row.id === selected);

  if (!matchingRow) return null;

  return (
    <>
      <ConsoleMessage
        value={matchingRow.nodes}
        showPreviousValues={showPreviousValues[0]}
      />
      {children}
    </>
  );
}

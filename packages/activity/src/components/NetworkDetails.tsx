import React, {PropsWithChildren} from 'react';
import {
  PaneToolbar,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@aside/chrome-ui-remote';
import {useLocalStorageState} from '@aside/react';

import {useActivityItem, useActivityStore} from '../hooks';

export function NetworkDetails({children}: PropsWithChildren) {
  const selected = useActivityItem();
  const {rows} = useActivityStore('network').data;
  const [tab, setTab] = useLocalStorageState('headers', {
    key: 'network-tab',
  });

  if (!selected) return null;

  const matchingRow = rows.find((row) => row.id === selected);

  if (!matchingRow || tab.loading) return null;

  return (
    <>
      <Tabs defaultValue={tab.data} onValueChange={setTab}>
        <PaneToolbar>
          <TabsList>
            <TabsTrigger value="headers">Headers</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="response">Response</TabsTrigger>
          </TabsList>
        </PaneToolbar>

        <TabsContent value="headers" />
        <TabsContent value="preview" />
        <TabsContent value="response" />
      </Tabs>
      {children}
    </>
  );
}

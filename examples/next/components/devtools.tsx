'use client';

import {
  ActivityStoreDescriptor,
  useNetworkActivity,
  ActivityProvider,
  Activity,
  ActivityDetails
} from '@aside/activity';
import {
  Pane,
  Tabs,
  PaneToolbar,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@aside/chrome-ui-remote';
import { Capability } from '@aside/core';
import { Aside, Devtools as AsideDevtools, useLocalStorageState } from '@aside/react';
import React, { useMemo, PropsWithChildren, useEffect, useState, useCallback } from 'react';

export function Devtools() {
  const appActivity: ActivityStoreDescriptor[] = useMemo(() => [], []);

  const capabilities: Capability[] = useMemo(() => ['network'], []);

  return (
    <Aside>
      <AsideDevtools capabilities={capabilities}>
        <AppActivityProvider activity={appActivity}>
          <AsideApp />
        </AppActivityProvider>
      </AsideDevtools>
    </Aside>
  );
}

function AppActivityProvider({
  activity,
  children
}: PropsWithChildren<{
  activity: ActivityStoreDescriptor[];
}>) {
  const networkActivity = useNetworkActivity();

  return <ActivityProvider activity={[...activity, networkActivity]}>{children}</ActivityProvider>;
}

function AsideApp() {
  const [tab, setTab] = useLocalStorageState('activity', {
    key: 'tab'
  });

  if (tab.loading) return null;

  return (
    <Pane>
      <Tabs defaultValue={tab.data} onValueChange={setTab}>
        <PaneToolbar>
          <TabsList>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
        </PaneToolbar>

        <TabsContent value="activity">
          <Activity
            storage={{
              disabled: false
            }}
          >
            <ActivityDetails type="network" />
          </Activity>
        </TabsContent>
      </Tabs>
    </Pane>
  );
}

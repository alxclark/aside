import React, {useMemo} from 'react';
import {
  ActivityStoreDescriptor,
  ActivityProvider,
  Activity,
  ActivityDetails,
  ActivityView,
  useMonitor,
} from '@aside/activity';
import {
  Pane,
  Tabs,
  PaneToolbar,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@aside/chrome-ui-remote';
import {
  Aside,
  Devtools as AsideDevtools,
  useLocalStorageState,
} from '@aside/react';
import {useComputedValue} from 'signals-react-safe';

import {counter, counterSquared} from './signals';

export function Devtools() {
  // Compose all signals into a single object
  const signals = useComputedValue(() => ({
    counter: counter.value,
    counterSquared: counterSquared.value,
  }));

  // Create a monitor with all signals to track past states
  const signalsMonitor = useMonitor(signals, [signals]);

  // Create an activity store to customize how to display your signal state
  const appActivity: ActivityStoreDescriptor[] = useMemo(
    () => [
      {
        type: 'signals',
        displayName: 'Signals',
        monitor: signalsMonitor,
        icon: 'https://preactjs.com/favicon.ico',
      },
    ],
    [signalsMonitor],
  );

  const capabilities = useMemo(() => ['network' as const], []);

  // Render the aside devtools remote with the activity provider
  return (
    <Aside>
      <AsideDevtools capabilities={capabilities}>
        <ActivityProvider activity={appActivity}>
          <AsideApp />
        </ActivityProvider>
      </AsideDevtools>
    </Aside>
  );
}

// Build the interface rendering in the devtools panel.
function AsideApp() {
  const [tab, setTab] = useLocalStorageState('activity', {
    key: 'tab',
  });

  if (tab.loading) return null;

  return (
    <Pane>
      <Tabs defaultValue={tab.data} onValueChange={setTab}>
        <PaneToolbar>
          <TabsList>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="signals">Signals</TabsTrigger>
          </TabsList>
        </PaneToolbar>

        <TabsContent value="activity">
          <Activity>
            <ActivityDetails type="signals" />
          </Activity>
        </TabsContent>
        <TabsContent value="signals">
          <ActivityView type="signals" />
        </TabsContent>
      </Tabs>
    </Pane>
  );
}

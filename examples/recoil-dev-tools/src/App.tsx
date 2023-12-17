/* eslint-disable import/order */
import React, {PropsWithChildren, useMemo} from 'react';
import {RecoilRoot} from 'recoil';
import {useRecoilMonitor} from '@aside/recoil';
import {
  Pane,
  PaneToolbar,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@aside/chrome-ui-remote';
import {Aside, Devtools, useLocalStorageState} from '@aside/react';

import 'todomvc-app-css/index.css';

import {
  Activity,
  ActivityDetails,
  ActivityView,
  ActivityProvider,
  ActivityStoreDescriptor,
  useNetworkActivity,
} from '@aside/activity';

import {NewTodo, Todos} from './components';

export function App() {
  return (
    <RecoilRoot key="recoil-example">
      <RecoilTodoMVC />
      <AsideDevtools />
    </RecoilRoot>
  );
}

function AsideDevtools() {
  const recoilMonitor = useRecoilMonitor({
    exclude: ['todosBase'],
  });

  const appActivity: ActivityStoreDescriptor[] = useMemo(
    () => [
      {
        type: 'recoil',
        displayName: 'Recoil',
        monitor: recoilMonitor,
        icon: 'https://recoiljs.org/img/favicon.png',
      },
    ],
    [recoilMonitor],
  );

  return (
    <Aside>
      <Devtools>
        <AppActivityProvider activity={appActivity}>
          <AsideApp />
        </AppActivityProvider>
      </Devtools>
    </Aside>
  );
}

function AppActivityProvider({
  activity,
  children,
}: PropsWithChildren<{activity: ActivityStoreDescriptor[]}>) {
  const networkActivity = useNetworkActivity();

  return (
    <ActivityProvider activity={[...activity, networkActivity]}>
      {children}
    </ActivityProvider>
  );
}

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
            <TabsTrigger value="recoil">Recoil</TabsTrigger>
          </TabsList>
        </PaneToolbar>

        <TabsContent value="activity">
          <Activity>
            <ActivityDetails type="recoil" />
          </Activity>
        </TabsContent>
        <TabsContent value="recoil">
          <ActivityView type="recoil" />
        </TabsContent>
      </Tabs>
    </Pane>
  );
}

export function RecoilTodoMVC() {
  return (
    <div className="todoapp">
      <header>
        <h1>todos</h1>
        <NewTodo />
        <Todos />
      </header>
    </div>
  );
}

/* eslint-disable import/order */
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';
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
import {Aside, DevTools, useLocalStorageState} from '@aside/react';

import 'todomvc-app-css/index.css';

import {
  Activity,
  ActivityDetails,
  ActivityView,
  ActivityProvider,
  ActivityStoreDescriptor,
  useMonitor,
  useNetworkActivity,
} from '@aside/activity';

import {NewTodo, Todos} from './components';

export function App() {
  const count = useState(0);

  return (
    <RecoilRoot key="recoil-example">
      <CountContext.Provider value={count}>
        <ReactCount />
        <RecoilTodoMVC />
        <AsideDevTools />
      </CountContext.Provider>
    </RecoilRoot>
  );
}

function ReactCount() {
  const [, setCount] = useContext(CountContext)!;

  return <button onClick={() => setCount((prev) => prev + 1)}>Click</button>;
}

const CountContext = createContext<
  [number, React.Dispatch<React.SetStateAction<number>>] | undefined
>(undefined);

function AsideDevTools() {
  const recoilMonitor = useRecoilMonitor({
    ignoredRecoilKeys: ['todosBase'],
  });

  const count = useContext(CountContext);
  const reactMonitor = useMonitor(
    {
      CountContext: count,
    },
    [count],
  );

  const countMonitor = useMonitor(
    {
      count: count![0],
    },
    [count],
  );

  const appActivity: ActivityStoreDescriptor[] = useMemo(
    () => [
      {
        type: 'react',
        displayName: 'React',
        monitor: reactMonitor,
        icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
      },
      {
        type: 'count',
        displayName: 'Count',
        monitor: countMonitor,
        icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
      },
      {
        type: 'recoil',
        displayName: 'Recoil',
        monitor: recoilMonitor,
        icon: 'https://recoiljs.org/img/favicon.png',
      },
    ],
    [countMonitor, reactMonitor, recoilMonitor],
  );

  return (
    <Aside>
      <DevTools>
        <AppActivityProvider activity={appActivity}>
          <AsideApp />
        </AppActivityProvider>
      </DevTools>
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
            <TabsTrigger value="react">React</TabsTrigger>
            <TabsTrigger value="count">Count</TabsTrigger>
          </TabsList>
        </PaneToolbar>

        <TabsContent value="activity">
          <Activity>
            <ActivityDetails type="recoil" />
            <ActivityDetails type="react" />
            <ActivityDetails type="count" />
            <ActivityDetails type="network" />
          </Activity>
        </TabsContent>
        <TabsContent value="recoil">
          <ActivityView type="recoil" />
        </TabsContent>
        <TabsContent value="react">
          <ActivityView type="react" />
        </TabsContent>
        <TabsContent value="count">
          <ActivityView type="count" />
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

/* eslint-disable import/order */
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';
import {RecoilRoot} from 'recoil';
import {useRecoilObserver} from '@aside/recoil';
import {
  Pane,
  PaneToolbar,
  Tabs,
  TabsList,
  TabsTrigger,
} from '@aside/chrome-ui-remote';
import {
  Aside,
  DevTools,
  useLocalStorageState,
  useNetworkRequests,
} from '@aside/react';

import 'todomvc-app-css/index.css';

import {
  Timeline,
  useDataStore,
  useObserver,
  TimelineDetails,
  DataView,
  Provider as DataStoreProvider,
  DataStoreDescriptor,
  Snapshot,
} from '@aside/timeline';

import {NewTodo, Todos} from './components';
import {NetworkRequest} from '@aside/extension';

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
  const recoilObserver = useRecoilObserver({
    ignoredRecoilKeys: ['todosBase'],
  });

  const count = useContext(CountContext);
  const reactObserver = useObserver(
    {
      CountContext: count,
    },
    [count],
  );

  const countObserver = useObserver(
    {
      count: count![0],
    },
    [count],
  );

  const appStores: DataStoreDescriptor[] = useMemo(
    () => [
      {
        type: 'react',
        displayName: 'React',
        observer: reactObserver,
        icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
      },
      {
        type: 'count',
        displayName: 'Count',
        observer: countObserver,
        icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
      },
      {
        type: 'recoil',
        displayName: 'Recoil',
        observer: recoilObserver,
        icon: 'https://recoiljs.org/img/favicon.png',
      },
    ],
    [countObserver, reactObserver, recoilObserver],
  );

  return (
    <Aside>
      <DevTools>
        <DataProvider appStores={appStores}>
          <AsideApp />
        </DataProvider>
      </DevTools>
    </Aside>
  );
}

function DataProvider({
  appStores,
  children,
}: PropsWithChildren<{appStores: DataStoreDescriptor[]}>) {
  const networkRequests = useNetworkRequests();

  const networkStore: DataStoreDescriptor<Snapshot<NetworkRequest>> =
    useMemo(() => {
      const last = networkRequests[networkRequests.length - 1];

      return {
        displayName: 'Network',
        type: 'network',
        rowName: (row) => {
          if (!row?.nodes.request?.url) return row.nodes.type;
          const urlParts = row.nodes.request.url.split('/');
          const lastUrlPath = urlParts[urlParts.length - 1];

          if (lastUrlPath.length === 0) {
            return row.nodes.type;
          }

          return lastUrlPath;
        },
        observer: {
          snapshot: {
            id: last?.time.toString() + last?.request.url,
            createdAt: last?.time.toString(),
            nodes: last,
          },
          snapshots: networkRequests.map((request) => ({
            id: request.time.toString() + request.request.url,
            createdAt: request.time.toString(),
            nodes: request,
          })),
          skipDiffing: true,
        },
      };
    }, [networkRequests]);

  return (
    <DataStoreProvider stores={[...appStores, networkStore]}>
      {children}
    </DataStoreProvider>
  );
}

function AsideApp() {
  const recoil = useDataStore('recoil');
  const react = useDataStore('react');
  const count = useDataStore('count');
  const network = useDataStore('network');

  const [tab, setTab] = useLocalStorageState('timeline', {
    key: 'tab',
  });

  if (tab.loading) return null;

  return (
    <Pane>
      <PaneToolbar>
        <Tabs defaultValue={tab.data} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="recoil">Recoil</TabsTrigger>
            <TabsTrigger value="react">React</TabsTrigger>
            <TabsTrigger value="count">Count</TabsTrigger>
          </TabsList>
        </Tabs>
      </PaneToolbar>

      {tab.data === 'timeline' && (
        <Timeline data={[recoil.data, react.data, count.data, network.data]}>
          <TimelineDetails type="recoil" />
          <TimelineDetails type="react" />
          <TimelineDetails type="count" />
          <TimelineDetails type="network" />
        </Timeline>
      )}
      {tab.data === 'recoil' && <DataView type="recoil" />}
      {tab.data === 'react' && <DataView type="react" />}
      {tab.data === 'count' && <DataView type="count" />}
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

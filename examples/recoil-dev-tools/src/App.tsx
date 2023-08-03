/* eslint-disable import/order */
import React, {createContext, useContext, useState} from 'react';
import {RecoilRoot} from 'recoil';
import {useRecoilObserver} from '@aside/recoil';
import {Pane, PaneToolbar, Tab, Tabs} from '@aside/chrome-ui';
import {Aside, DevTools, useLocalStorageState} from '@aside/react';

import 'todomvc-app-css/index.css';

import {
  Timeline,
  useDataStore,
  useObserver,
  TimelineDetails,
  DataView,
  Provider as DataStoreProvider,
} from '@aside/timeline';

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

  return (
    <Aside>
      <DevTools>
        <DataStoreProvider
          stores={[
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
          ]}
        >
          <AsideApp />
        </DataStoreProvider>
      </DevTools>
    </Aside>
  );
}

function AsideApp() {
  const recoil = useDataStore('recoil');
  const react = useDataStore('react');
  const count = useDataStore('count');
  const [tab, setTab] = useLocalStorageState('timeline', {
    key: 'tab',
  });

  if (tab.loading) return null;

  return (
    <Pane>
      <PaneToolbar>
        <Tabs selected={tab.data} setSelected={(selected) => setTab(selected)}>
          <Tab id="timeline" label="Timeline" />
          <Tab id="recoil" label="Recoil" />
          <Tab id="react" label="React" />
          <Tab id="count" label="Count" />
        </Tabs>
      </PaneToolbar>

      {tab.data === 'timeline' && (
        <Timeline data={[recoil.data, react.data, count.data]}>
          <TimelineDetails type="recoil" />
          <TimelineDetails type="react" />
          <TimelineDetails type="count" />
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

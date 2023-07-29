/* eslint-disable import/order */
import React, {createContext, useContext, useState} from 'react';
import {RecoilRoot} from 'recoil';
import {
  DevTools as RecoilDevTools,
  RecoilTimeline,
  StateTree,
  useRecoilData,
  useRecoilObserver,
} from '@aside/recoil';
import {Pane, PaneToolbar, Tab, Tabs} from '@aside/chrome-ui';
import {Aside, DevTools, useLocalStorageState} from '@aside/react';

import 'todomvc-app-css/index.css';

import {
  ReactDevTools,
  ReactState,
  ReactTimeline,
  Timeline,
  useObserver,
  useReactData,
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

  return (
    <Aside>
      <DevTools>
        <RecoilDevTools {...recoilObserver}>
          <ReactDevTools {...reactObserver}>
            <AsideApp />
          </ReactDevTools>
        </RecoilDevTools>
      </DevTools>
    </Aside>
  );
}

function AsideApp() {
  const recoil = useRecoilData();
  const react = useReactData();
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
        </Tabs>
      </PaneToolbar>

      {tab.data === 'timeline' && (
        <Timeline data={[recoil, react]}>
          <RecoilTimeline />
          <ReactTimeline />
        </Timeline>
      )}
      {tab.data === 'recoil' && <StateTree />}
      {tab.data === 'react' && <ReactState />}
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

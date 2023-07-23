import React, {createContext, useContext, useState} from 'react';
import {RecoilRoot} from 'recoil';
import {
  DevTools as RecoilDevTools,
  RecoilTimeline,
  StateTree,
  useRecoilData,
  useRecoilObserver,
} from '@aside/recoil';
import {Aside, DevTools, usePersistedState} from '@aside/react';
import {
  ChromeUIComponents,
  Pane,
  PaneToolbar,
  ReactDevTools,
  ReactTimeline,
  Tab,
  Tabs,
  Timeline,
  useObserver,
  useReactData,
} from '@aside/chrome-ui';

import 'todomvc-app-css/index.css';

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
  const reactObserver = useObserver({
    CountContext: count,
  });

  console.log({reactObserver});

  return (
    <Aside>
      <DevTools components={ChromeUIComponents}>
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
  const [{data: tab, loading}, setTab] = usePersistedState('timeline', {
    key: 'tab',
  });

  console.log({react});

  if (loading || !tab) return null;

  return (
    <Pane>
      <PaneToolbar>
        <Tabs selected={tab} setSelected={(selected) => setTab(selected)}>
          <Tab id="timeline" label="Timeline" />
          <Tab id="recoil" label="Recoil" />
        </Tabs>
      </PaneToolbar>
      {tab === 'recoil' && <StateTree />}
      {tab === 'timeline' && (
        <Timeline data={[recoil, react]}>
          <RecoilTimeline />
          <ReactTimeline />
        </Timeline>
      )}
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

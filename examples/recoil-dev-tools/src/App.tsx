import React, {useState} from 'react';
import {RecoilRoot} from 'recoil';
import {
  DevTools as RecoilDevTools,
  RecoilTimeline,
  StateTree,
  useRecoilData,
  useRecoilObserver,
} from '@aside/recoil';
import {Aside, DevTools, usePersistedState} from '@aside/react';
import {Pane, PaneToolbar, Tab, Tabs, Timeline} from '@aside/chrome-ui';

import 'todomvc-app-css/index.css';

import {NewTodo, Todos} from './components';

export function App() {
  return (
    <RecoilRoot key="recoil-example">
      <RecoilTodoMVC />
      <AsideDevTools />
    </RecoilRoot>
  );
}

function AsideDevTools() {
  const recoilObserver = useRecoilObserver({
    ignoredRecoilKeys: ['todosBase'],
  });

  return (
    <Aside>
      <DevTools>
        <RecoilDevTools {...recoilObserver}>
          <AsideApp />
        </RecoilDevTools>
      </DevTools>
    </Aside>
  );
}

function AsideApp() {
  const recoil = useRecoilData();
  const [{data: tab, loading}, setTab] = usePersistedState('timeline', {
    key: 'tab',
  });

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
        <Timeline data={[recoil]}>
          <RecoilTimeline />
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

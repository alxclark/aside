import React from 'react';
import {DevTools} from '@aside/recoil';
import {RecoilRoot} from 'recoil';

import 'todomvc-app-css/index.css';
import {NewTodo, Todos} from './components';

export function App() {
  return (
    <RecoilRoot key="recoil-example">
      <RecoilTodoMVC />
      <DevTools ignoredRecoilKeys={['todosBase']} />
    </RecoilRoot>
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

/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @shopify/jsx-prefer-fragment-wrappers */
import React from 'react';
import {useRecoilCallback, useRecoilValue} from 'recoil';

import {Footer} from '../Footer';
import {
  completedTodosIdsAtom,
  filteredTodoIdsAtom,
  getTodoAtom,
  todoIdsAtom,
} from '../../atoms';
import {TodoItem} from '../TodoItem';

export function Todos() {
  const todoIds = useRecoilValue(todoIdsAtom);
  const completedTodoIds = useRecoilValue(completedTodosIdsAtom);
  const filteredTodoIds = useRecoilValue(filteredTodoIdsAtom);

  const completeAllTodos = useRecoilCallback(
    ({set, snapshot}) =>
      () => {
        const newCompletedValue = !snapshot
          .getLoadable(getTodoAtom(filteredTodoIds[0]))
          .getValue()?.completed;

        filteredTodoIds.forEach((id) => {
          set(getTodoAtom(id), (todo) => {
            if (!todo) return;

            return {
              ...todo,
              completed: newCompletedValue,
            };
          });
        });
      },
    [todoIds, completedTodoIds],
  );

  return (
    <section className="main">
      {Boolean(todoIds.length) && (
        <span>
          <input
            className="toggle-all"
            type="checkbox"
            checked={completedTodoIds.length === todoIds.length}
            readOnly
          />
          <label onClick={() => completeAllTodos()} />
        </span>
      )}
      <ul className="todo-list">
        {filteredTodoIds.map((id) => (
          <TodoItem key={id} id={id} />
        ))}
      </ul>
      {Boolean(todoIds.length) && <Footer />}
    </section>
  );
}

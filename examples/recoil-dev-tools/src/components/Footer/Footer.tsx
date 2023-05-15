/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import {useRecoilCallback, useRecoilState, useRecoilValue} from 'recoil';
import classNames from 'classnames';

import {
  activeTodosIdsAtom,
  completedTodosIdsAtom,
  getTodoAtom,
  todoFilterAtom,
} from '../../atoms';

export function Footer() {
  const activeTodosCount = useRecoilValue(activeTodosIdsAtom).length;
  const completedTodosIds = useRecoilValue(completedTodosIdsAtom);
  const [filter, setFilter] = useRecoilState(todoFilterAtom);

  const itemWord = activeTodosCount === 1 ? 'item' : 'items';

  const handleClearCompleted = useRecoilCallback(
    ({reset}) =>
      () => {
        completedTodosIds.forEach((id) => {
          reset(getTodoAtom(id));
        });
      },
    [completedTodosIds],
  );

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeTodosCount || 'No'}</strong> {itemWord} left
      </span>
      <ul className="filters">
        <li>
          <a
            onClick={() => setFilter('all')}
            className={classNames(filter === 'all' && 'selected')}
          >
            All
          </a>
          <a
            onClick={() => setFilter('active')}
            className={classNames(filter === 'active' && 'selected')}
          >
            Active
          </a>
          <a
            onClick={() => setFilter('completed')}
            className={classNames(filter === 'completed' && 'selected')}
          >
            Completed
          </a>
        </li>
      </ul>
      {Boolean(completedTodosIds.length) && (
        <button className="clear-completed" onClick={handleClearCompleted}>
          Clear completed
        </button>
      )}
    </footer>
  );
}

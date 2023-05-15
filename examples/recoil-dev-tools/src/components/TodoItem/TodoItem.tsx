/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import {useRecoilState, useRecoilValue} from 'recoil';
import classnames from 'classnames';

import {getTodoAtom, selectedTodoIdAtom} from '../../atoms';

export interface Props {
  id: number;
}

export function TodoItem({id}: Props) {
  const [todo, setTodo] = useRecoilState(getTodoAtom(id));
  const [selectedTodoId, setSelectedTodoId] =
    useRecoilState(selectedTodoIdAtom);

  if (!todo) return null;

  const isSelected = todo.id === selectedTodoId;

  function completeTodo() {
    setTodo((prev) => ({...prev!, completed: !prev?.completed}));
  }

  function clearTodo() {
    setTodo(undefined);
  }

  function toggleEdit() {
    setSelectedTodoId(todo!.id);
  }

  return (
    <li
      className={classnames({
        completed: todo.completed,
        editing: isSelected,
      })}
    >
      {!isSelected && (
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={todo.completed ?? false}
            onChange={completeTodo}
          />
          <label onDoubleClick={toggleEdit}>{todo.description}</label>
          <button className="destroy" onClick={clearTodo} />
        </div>
      )}
    </li>
  );
}

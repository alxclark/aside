import React, {useState} from 'react';
import {useRecoilCallback} from 'recoil';

import {getTodoAtom, todosCreatedAtom} from '../../atoms';

export function NewTodo() {
  const [text, setText] = useState('');

  const handleSubmit = useRecoilCallback<
    [React.KeyboardEvent<HTMLInputElement>],
    void
  >(
    ({set, snapshot}) =>
      (event) => {
        if (event.key === 'Enter') {
          const text = event.currentTarget.value.trim();
          const id = snapshot.getLoadable(todosCreatedAtom).getValue() + 1;
          set(getTodoAtom(id), {id, description: text});
          setText('');
        }
      },
    [],
  );

  return (
    <input
      autoComplete="new-todo"
      className="new-todo"
      type="text"
      placeholder="What needs to be done?"
      value={text}
      onChange={(event) => setText(event.target.value)}
      onKeyDown={handleSubmit}
    />
  );
}

import {DefaultValue, atom, atomFamily, selector, selectorFamily} from 'recoil';

import {Todo, TodoFilter} from './types';

export const getTodoAtomBase = atomFamily<Todo | undefined, number>({
  default: undefined,
  key: 'todosBase',
});

export const getTodoAtom = selectorFamily<Todo | undefined, number>({
  key: 'todos',
  get:
    (id) =>
    ({get}) =>
      get(getTodoAtomBase(id)),
  set:
    (id) =>
    ({set, reset, get}, value) => {
      const todoAtom = getTodoAtomBase(id);
      if (value instanceof DefaultValue || !value) {
        reset(todoAtom);
        set(todoIdsAtom, (prev) => prev.filter((todoId) => todoId !== id));
        return;
      }

      const isNewTodo = !get(todoAtom);

      if (isNewTodo) {
        set(todoIdsAtom, (prev) => [...prev, id]);
        set(todosCreatedAtom, (prev) => prev + 1);
      }

      set(todoAtom, value);
    },
});

export const todoIdsAtom = atom<number[]>({
  key: 'todoIds',
  default: [],
});

export const todosCreatedAtom = atom<number>({
  key: 'todosCreated',
  default: 0,
});

export const activeTodosIdsAtom = selector({
  key: 'activeTodoIds',
  get: ({get}) => {
    const activeTodoIds = get(todoIdsAtom)
      .map((id) => get(getTodoAtom(id)))
      .filter((todo) => todo && !todo.completed)
      .map((todo) => todo!.id);

    return activeTodoIds;
  },
});

export const completedTodosIdsAtom = selector({
  key: 'completedTodoIds',
  get: ({get}) => {
    const allTodoIds = get(todoIdsAtom);
    const activeTodoIds = get(activeTodosIdsAtom);

    const completedTodoIds = allTodoIds.filter(
      (id) => !activeTodoIds.includes(id),
    );

    return completedTodoIds;
  },
});

export const todoFilterAtom = atom<TodoFilter>({
  key: 'todoFilter',
  default: 'all',
});

export const filteredTodoIdsAtom = selector<number[]>({
  key: 'filteredTodoIds',
  get: ({get}) => {
    const filter = get(todoFilterAtom);
    const todoIds = get(todoIdsAtom);
    const activeTodoIds = get(activeTodosIdsAtom);
    const completedTodoIds = get(completedTodosIdsAtom);

    const ids =
      // eslint-disable-next-line no-nested-ternary
      filter === 'all'
        ? todoIds
        : filter === 'completed'
        ? completedTodoIds
        : activeTodoIds;

    return ids;
  },
});

export const selectedTodoIdAtom = atom<number>({
  key: 'selectedTodoId',
  default: 0,
});

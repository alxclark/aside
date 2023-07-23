import {useContext} from 'react';

import {ReactStateContext} from '../../contexts';
import {TimelineData} from '../../Timeline';
import {createDiff} from '../../diff';

export function useReactData(): TimelineData {
  const state = useContext(ReactStateContext);

  if (!state) {
    throw new Error('No state provided');
  }

  return {
    type: 'react',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
    name: (snapshot) => Object.keys(snapshot.nodes).join(', '),
    query: (snapshot) => Object.keys(snapshot.nodes).join(''),
    rows: state.snapshots.map((next, index) => {
      const previous = state.snapshots[index - 1]?.nodes ?? {};

      return {
        id: next.id,
        createdAt: next.createdAt,
        nodes: createDiff({
          previous,
          next: next.nodes ?? {},
        }),
      };
    }),
    onDelete: () => state.clearSnapshot?.(),
  };
}

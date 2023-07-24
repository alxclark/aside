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
    name: (row) => Object.keys(row.nodes).join(', '),
    query: (row) => Object.keys(row.nodes).join(''),
    rows: state.snapshots.map((next, index) => {
      const previous =
        state.snapshots[index - 1]?.nodes ?? state.previous?.nodes ?? {};

      const nodes = createDiff({
        previous,
        next: next.nodes,
      });

      return {
        id: next.id,
        createdAt: next.createdAt,
        nodes,
      };
    }),
    onDelete: () => state.clearSnapshots?.(),
  };
}

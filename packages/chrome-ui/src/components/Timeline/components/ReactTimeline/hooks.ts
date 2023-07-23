import {useContext} from 'react';

import {ReactStateContext} from '../../contexts';
import {TimelineData} from '../../Timeline';

export function useReactData(): TimelineData<any> {
  const state = useContext(ReactStateContext);

  return {
    type: 'react',
    icon: '',
    name: () => Object.keys(state).join(', '),
    query: () => Object.keys(state).join(''),
    rows: [
      {
        id: 'react-0',
        createdAt: Date.now().toString(),
      },
    ],
  };
}

import {useContext} from 'react';

import {ReactTimelineContext} from '../../contexts';
import {TimelineData} from '../../Timeline';

export function useReactData(): TimelineData {
  const timeline = useContext(ReactTimelineContext);

  if (!timeline) {
    throw new Error('No state provided');
  }

  return timeline;
}

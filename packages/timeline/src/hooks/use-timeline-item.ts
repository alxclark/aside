import {useContext} from 'react';

import {TimelineItemContext} from '../contexts';

export function useTimelineItem(): string | undefined {
  const item = useContext(TimelineItemContext);

  return item;
}

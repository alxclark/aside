import {createRemoteReactComponent} from '@remote-ui/react';

export interface DividerProps {
  horizontal?: boolean;
}

export const Divider = createRemoteReactComponent<
  'ChromeUIDivider',
  DividerProps
>('ChromeUIDivider');

import {createRemoteReactComponent} from '@remote-ui/react';

import type {Props} from './Link';

export const Link = createRemoteReactComponent<'ChromeUILink', Props>(
  'ChromeUILink',
);

import {createRemoteReactComponent} from '@remote-ui/react';

import type {Props} from './Log';

export const Log = createRemoteReactComponent<'ChromeUILog', Props>(
  'ChromeUILog',
);

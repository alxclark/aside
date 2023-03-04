import {createRemoteReactComponent} from '@remote-ui/react';

import {Props} from './Log';

export const Log = createRemoteReactComponent<'ChromeUILog', Props>(
  'ChromeUILog',
);

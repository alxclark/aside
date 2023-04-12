import {createRemoteReactComponent} from '@remote-ui/react';

import type {Props} from './TextField';

export const TextField = createRemoteReactComponent<'ChromeUITextField', Props>(
  'ChromeUITextField',
);

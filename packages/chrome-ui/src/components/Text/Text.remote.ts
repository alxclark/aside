import {createRemoteReactComponent} from '@remote-ui/react';

import {Props} from './Text';

export const Text = createRemoteReactComponent<'ChromeUIText', Props>(
  'ChromeUIText',
);

import {createRemoteReactComponent} from '@remote-ui/react';

import {Props} from './View';

export const View = createRemoteReactComponent<'ChromeUIView', Props>(
  'ChromeUIView',
);

import {createRemoteReactComponent} from '@remote-ui/react';

import {Props} from './Button';

export const Button = createRemoteReactComponent<'ChromeUIButton', Props>(
  'ChromeUIButton',
);

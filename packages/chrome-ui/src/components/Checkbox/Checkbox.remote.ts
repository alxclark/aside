import {createRemoteReactComponent} from '@remote-ui/react';

import {Props} from './Checkbox';

export const Checkbox = createRemoteReactComponent<'ChromeUICheckbox', Props>(
  'ChromeUICheckbox',
);

import {createRemoteReactComponent} from '@remote-ui/react';

import type {Props, TabProps} from './Tabs';

export const Tabs = createRemoteReactComponent<'ChromeUITabs', Props>(
  'ChromeUITabs',
);

export const Tab = createRemoteReactComponent<'ChromeUITab', TabProps>(
  'ChromeUITab',
);

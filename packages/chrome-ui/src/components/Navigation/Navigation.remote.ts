import {createRemoteReactComponent} from '@remote-ui/react';

import type {Props} from './Navigation';
import type {NavigationTabProps} from './components';

export const Navigation = createRemoteReactComponent<
  'ChromeUINavigation',
  Props
>('ChromeUINavigation');

export const NavigationTab = createRemoteReactComponent<
  'ChromeUINavigationTab',
  NavigationTabProps
>('ChromeUINavigationTab');

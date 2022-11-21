import {createRemoteReactComponent} from '@remote-ui/react';
import {NavigationProps, NavigationTabProps} from '@companion/chrome-ui';

export const Navigation = createRemoteReactComponent<
  'Navigation',
  NavigationProps
>('Navigation');

export const NavigationTab = createRemoteReactComponent<
  'NavigationTab',
  NavigationTabProps
>('NavigationTab');

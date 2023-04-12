import {createRemoteReactComponent} from '@remote-ui/react';

import type {Props} from './Pane';
import type {
  PaneContentProps,
  PaneToolbarProps,
  PaneToolbarSectionProps,
  PaneToolbarItemProps,
} from './components';

const Pane = createRemoteReactComponent<'ChromeUIPane', Props>('ChromeUIPane');

const PaneContent = createRemoteReactComponent<
  'ChromeUIPaneContent',
  PaneContentProps
>('ChromeUIPaneContent');

const PaneToolbar = createRemoteReactComponent<
  'ChromeUIPaneToolbar',
  PaneToolbarProps
>('ChromeUIPaneToolbar');

const PaneToolbarSection = createRemoteReactComponent<
  'ChromeUIPaneToolbarSection',
  PaneToolbarSectionProps
>('ChromeUIPaneToolbarSection');

const PaneToolbarItem = createRemoteReactComponent<
  'ChromeUIPaneToolbarItem',
  PaneToolbarItemProps
>('ChromeUIPaneToolbarItem');

export {Pane, PaneToolbar, PaneToolbarSection, PaneToolbarItem, PaneContent};

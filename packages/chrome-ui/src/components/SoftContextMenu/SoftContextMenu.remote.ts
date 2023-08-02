import {createRemoteReactComponent} from '@remote-ui/react';

import type {
  SoftContextMenuProps,
  SoftContextMenuItemProps,
} from './SoftContextMenu';

export const SoftContextMenu = createRemoteReactComponent<
  'ChromeUISoftContextMenu',
  SoftContextMenuProps
>('ChromeUISoftContextMenu');

export const SoftContextMenuItem = createRemoteReactComponent<
  'ChromeUISoftContextMenuItem',
  SoftContextMenuItemProps
>('ChromeUISoftContextMenuItem');

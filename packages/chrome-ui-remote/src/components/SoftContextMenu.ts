import {createRemoteReactComponent} from '@remote-ui/react';
import {PropsWithChildren} from 'react';

export type SoftContextMenuProps = PropsWithChildren<{
  selected: string[];
  onPress(id: string): void;
}>;

export const SoftContextMenu = createRemoteReactComponent<
  'ChromeUISoftContextMenu',
  SoftContextMenuProps
>('ChromeUISoftContextMenu');

export type SoftContextMenuItemProps = PropsWithChildren<{
  id: string;
}>;

export const SoftContextMenuItem = createRemoteReactComponent<
  'ChromeUISoftContextMenuItem',
  SoftContextMenuItemProps
>('ChromeUISoftContextMenuItem');

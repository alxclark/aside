import {createRemoteReactComponent} from '@remote-ui/react';
import {PropsWithChildren} from 'react';

export type PaneProps = PropsWithChildren<{}>;

const Pane = createRemoteReactComponent<'ChromeUIPane', PaneProps>(
  'ChromeUIPane',
);

export type PaneContentProps = PropsWithChildren<{}>;

const PaneContent = createRemoteReactComponent<
  'ChromeUIPaneContent',
  PaneContentProps
>('ChromeUIPaneContent');

export type PaneToolbarProps = PropsWithChildren<{
  separatorBefore?: boolean;
}>;

const PaneToolbar = createRemoteReactComponent<
  'ChromeUIPaneToolbar',
  PaneToolbarProps
>('ChromeUIPaneToolbar');

export type PaneToolbarSectionProps = PropsWithChildren<{
  separatorBefore?: boolean;
}>;

const PaneToolbarSection = createRemoteReactComponent<
  'ChromeUIPaneToolbarSection',
  PaneToolbarSectionProps
>('ChromeUIPaneToolbarSection');

export type PaneToolbarItemProps = PropsWithChildren<{}>;

const PaneToolbarItem = createRemoteReactComponent<
  'ChromeUIPaneToolbarItem',
  PaneToolbarItemProps
>('ChromeUIPaneToolbarItem');

export {Pane, PaneToolbar, PaneToolbarSection, PaneToolbarItem, PaneContent};

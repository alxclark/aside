import {createRemoteReactComponent} from '@remote-ui/react';
import {PropsWithChildren} from 'react';

export type TabsProps = PropsWithChildren<{
  /** The value for the selected tab, if controlled */
  value?: string;
  /** The value of the tab to select by default, if uncontrolled */
  defaultValue?: string;
  /** A function called when a new tab is selected */
  onValueChange?: (value: string) => void;
  /**
   * The orientation the tabs are layed out.
   * Mainly so arrow navigation is done accordingly (left & right vs. up & down)
   * @defaultValue horizontal
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * The direction of navigation between toolbar items.
   */
  dir?: 'ltr' | 'rtl';
  /**
   * Whether a tab is activated automatically or manually.
   * @defaultValue automatic
   * */
  activationMode?: 'automatic' | 'manual';
  className?: string;
}>;

export const Tabs = createRemoteReactComponent<'ChromeUITabs', TabsProps>(
  'ChromeUITabs',
);

export type TabsListProps = PropsWithChildren<{
  /**
   * Whether keyboard navigation should loop around
   * @defaultValue false
   */
  loop?: boolean;
  className?: string;
}>;

export const TabsList = createRemoteReactComponent<
  'ChromeUITabsList',
  TabsListProps
>('ChromeUITabsList');

export type TabsTriggerProps = PropsWithChildren<{
  value: string;
  className?: string;
}>;

export const TabsTrigger = createRemoteReactComponent<
  'ChromeUITabsTrigger',
  TabsTriggerProps
>('ChromeUITabsTrigger');

export type TabsContentProps = PropsWithChildren<{
  value: string;
  className?: string;
}>;

export const TabsContent = createRemoteReactComponent<
  'ChromeUITabsContent',
  TabsContentProps
>('ChromeUITabsContent');

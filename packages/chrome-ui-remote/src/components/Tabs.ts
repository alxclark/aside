import {createRemoteReactComponent} from '@remote-ui/react';
import {PropsWithChildren} from 'react';

export type TabsProps = PropsWithChildren<{
  selected: string;
  setSelected?(id: string): void;
}>;

export const Tabs = createRemoteReactComponent<'ChromeUITabs', TabsProps>(
  'ChromeUITabs',
);

export interface TabProps {
  label: string;
  id: string;
}

export const Tab = createRemoteReactComponent<'ChromeUITab', TabProps>(
  'ChromeUITab',
);

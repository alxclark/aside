import {createRemoteReactComponent} from '@remote-ui/react';

export interface FlexProps {
  children: React.ReactNode;
  direction?: 'row' | 'column';
  fullHeight?: boolean;
  gap?: string;
  alignItems?: 'center' | 'start';
  justifyContent?: 'space-between' | 'center';
  wrap?: boolean;
}

export const Flex = createRemoteReactComponent<'ChromeUIFlex', FlexProps>(
  'ChromeUIFlex',
);

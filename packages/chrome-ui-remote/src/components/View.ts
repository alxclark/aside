import {createRemoteReactComponent} from '@remote-ui/react';
import {PropsWithChildren} from 'react';

export type ViewProps = PropsWithChildren<{
  children: React.ReactNode;
  className?: string;
}>;

export const View = createRemoteReactComponent<'ChromeUIView', ViewProps>(
  'ChromeUIView',
);

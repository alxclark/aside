import {createRemoteReactComponent} from '@remote-ui/react';

export interface LinkProps {
  children: React.ReactNode;
  to: string;
}

export const Link = createRemoteReactComponent<'ChromeUILink', LinkProps>(
  'ChromeUILink',
);

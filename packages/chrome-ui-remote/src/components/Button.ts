import {createRemoteReactComponent} from '@remote-ui/react';
import {PropsWithChildren} from 'react';

export type ButtonProps = PropsWithChildren<{
  asChild?: boolean;
  variant?: 'default';
  size?: 'default' | 'icon';
  onClick?: () => void;
  title?: string;
  className?: string;
}>;

export const Button = createRemoteReactComponent<'ChromeUIButton', ButtonProps>(
  'ChromeUIButton',
);

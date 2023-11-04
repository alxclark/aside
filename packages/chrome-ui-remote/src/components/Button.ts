import {ButtonHTMLAttributes} from 'react';
import {createRemoteReactComponent} from '@remote-ui/react';

import {RemoteSafeAttributes} from '../types';

export interface ButtonProps
  extends RemoteSafeAttributes<ButtonHTMLAttributes<HTMLButtonElement>> {
  asChild?: boolean;
  variant?: 'default';
  size?: 'default' | 'icon';
}

export const Button = createRemoteReactComponent<'ChromeUIButton', ButtonProps>(
  'ChromeUIButton',
);

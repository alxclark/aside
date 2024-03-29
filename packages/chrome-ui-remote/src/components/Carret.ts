import {createRemoteReactComponent} from '@remote-ui/react';

export interface CarretProps {
  direction: 'down' | 'right';
  className?: string;
}

export const Carret = createRemoteReactComponent<'ChromeUICarret', CarretProps>(
  'ChromeUICarret',
);

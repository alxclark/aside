import {createRemoteReactComponent} from '@remote-ui/react';

export interface CarretProps {
  direction: 'down' | 'right';
}

export const Carret = createRemoteReactComponent<'ChromeUICarret', CarretProps>(
  'ChromeUICarret',
);

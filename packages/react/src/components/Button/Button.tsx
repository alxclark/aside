import {createRemoteReactComponent} from '@remote-ui/react';

export const Button = createRemoteReactComponent<'Button', {onPress(): void}>(
  'Button',
);
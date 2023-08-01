import {createRemoteReactComponent} from '@remote-ui/react';

import type {Props} from './ConsoleMessage';

export const ConsoleMessage = createRemoteReactComponent<
  'ChromeUIConsoleMessage',
  Props
>('ChromeUIConsoleMessage');

import {LogProps} from '@aside/chrome-ui';
import {createRemoteReactComponent} from '@remote-ui/react';

export const Log = createRemoteReactComponent<'Log', LogProps>('Log');

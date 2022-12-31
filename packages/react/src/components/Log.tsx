import {LogProps} from '@companion/chrome-ui';
import {createRemoteReactComponent} from '@remote-ui/react';

export const Log = createRemoteReactComponent<'Log', LogProps>('Log');

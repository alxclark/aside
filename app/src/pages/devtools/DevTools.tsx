import {
  RemoteRenderer,
  createController,
  createRemoteReceiver,
} from '@remote-ui/react/host';
import {createEndpoint} from '@remote-ui/rpc';
import React, {useEffect, useMemo} from 'react';
import type {BackgroundApiForDevTools, DevToolsApi} from '@companion/extension';
import {fromDevTools} from '@companion/extension';
import {Button, Navigation, NavigationTab} from '@companion/chrome-ui';

import {List, ListItem} from '../../components';
import {setupDebug} from '../../foundation/Debug';

import '@companion/chrome-ui/dist/styles.css';

const background = createEndpoint<BackgroundApiForDevTools>(fromDevTools(), {
  callable: ['getDevToolsChannel', 'log'],
});

setupDebug({
  onMessage: (event) => {
    background.call.log(
      'devtools',
      ...(event as CustomEvent<any>).detail.message,
    );
  },
});

export function BrowserExtensionRenderer() {
  const controller = useMemo(
    () => createController({Button, List, ListItem, Navigation, NavigationTab}),
    [],
  );
  const receiver = useMemo(() => createRemoteReceiver(), []);

  useEffect(() => {
    const devToolsApi: DevToolsApi = {
      getDevToolsChannel() {
        return receiver.receive;
      },
    };

    background.expose(devToolsApi);
  }, [receiver]);

  return <RemoteRenderer receiver={receiver} controller={controller} />;
}

export function DevTools() {
  return <BrowserExtensionRenderer />;
}

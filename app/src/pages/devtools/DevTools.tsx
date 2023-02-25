import {
  RemoteRenderer,
  createController,
  createRemoteReceiver,
} from '@remote-ui/react/host';
import {createEndpoint} from '@remote-ui/rpc';
import React, {useEffect, useMemo, useState} from 'react';
import type {BackgroundApiForDevTools, DevToolsApi} from '@aside/extension';
import {fromDevTools} from '@aside/extension';
import {
  Button,
  Navigation,
  NavigationTab,
  Log,
  Table,
  TableRow,
  TableCell,
} from '@aside/chrome-ui';

import {List, ListItem} from '../../components';
import {setupDebug} from '../../foundation/Debug';

import '@aside/chrome-ui/dist/styles.css';

const background = createEndpoint<BackgroundApiForDevTools>(fromDevTools(), {
  callable: ['getDevToolsChannel', 'log', 'renewReceiver'],
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
    () =>
      createController({
        Button,
        List,
        ListItem,
        Navigation,
        NavigationTab,
        Log,
        Table,
        TableRow,
        TableCell,
      }),
    [],
  );
  const [receiver, setReceiver] = useState(createRemoteReceiver());

  useEffect(() => {
    const devToolsApi: DevToolsApi = {
      getDevToolsChannel() {
        return receiver.receive;
      },
      renewReceiver() {
        setReceiver(createRemoteReceiver());
      },
    };

    background.expose(devToolsApi);
  }, [receiver]);

  return <RemoteRenderer receiver={receiver} controller={controller} />;
}

export function DevTools() {
  return <BrowserExtensionRenderer />;
}

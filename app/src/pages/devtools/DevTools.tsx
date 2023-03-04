import {
  RemoteRenderer,
  createController,
  createRemoteReceiver,
} from '@remote-ui/react/host';
import {createEndpoint} from '@remote-ui/rpc';
import React, {useEffect, useMemo, useState} from 'react';
import type {BackgroundApiForDevTools, DevToolsApi} from '@aside/extension';
import {fromDevTools} from '@aside/extension';
import {AllComponents as ChromeUIComponents} from '@aside/chrome-ui';

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
        ...prefixComponents(ChromeUIComponents, 'ChromeUI'),
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

function prefixComponents(components: {[key: string]: any}, prefix: string) {
  return Object.keys(components).reduce<{[key: string]: any}>((prev, key) => {
    const prefixedKey = prefix + key;
    prev[prefixedKey] = components[key];

    return prev;
  }, {});
}

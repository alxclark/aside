import {
  RemoteRenderer,
  createController,
  createRemoteReceiver,
} from '@remote-ui/react/host';
import {createEndpoint} from '@remote-ui/rpc';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import type {BackgroundApiForDevTools, DevToolsApi} from '@aside/extension';
import {fromDevTools} from '@aside/extension';
import {AllComponents as ChromeUIComponents} from '@aside/chrome-ui/react';

import {setupDebug} from '../../foundation/Debug';

import '@aside/chrome-ui/css';

// const contentScript = createEndpoint<any>(fromDevTools(), {
//   callable: ['getDevToolsChannel', 'log', 'renewReceiver', 'mountDevTools'],
// });

// setupDebug({
//   onMessage: (event) => {
//     contentScript.call.log(
//       'devtools',
//       ...(event as CustomEvent<any>).detail.message,
//     );
//   },
// });

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
    async function setup() {
      const messenger = await fromDevTools();
      const contentScript = createEndpoint<any>(messenger, {
        callable: [
          'getDevToolsChannel',
          'log',
          'renewReceiver',
          'mountDevTools',
        ],
      });

      const devToolsApi: DevToolsApi = {
        getDevToolsChannel() {
          return receiver.receive;
        },
        renewReceiver() {
          setReceiver(createRemoteReceiver());
        },
      };

      contentScript.expose(devToolsApi);

      contentScript.call.mountDevTools();
    }
    setup();
  }, [receiver]);

  return <RemoteRenderer receiver={receiver} controller={controller} />;
}

export function DevTools() {
  // const connect = useCallback(() => {
  //   console.log('running effect');

  //   const port = browser.runtime.connect({
  //     name: `${browser.devtools.inspectedWindow.tabId}`,
  //   });

  //   console.log('[panel]', {port});

  //   port.onMessage.addListener((msg) => {
  //     // This prints in devtools-on-devtools: https://stackoverflow.com/q/12291138
  //     // To print in tab's console see `chrome.devtools.inspectedWindow.eval`
  //     console.log('[Panel] onMessage', {msg});
  //   });

  //   port.postMessage('foo');
  // }, []);

  // console.log('what');

  // return (
  //   <button onClick={connect}>
  //     Click me please!!! {browser.devtools.inspectedWindow.tabId}
  //   </button>
  // );
  return <BrowserExtensionRenderer />;
}

function prefixComponents(components: {[key: string]: any}, prefix: string) {
  return Object.keys(components).reduce<{[key: string]: any}>((prev, key) => {
    const prefixedKey = prefix + key;
    prev[prefixedKey] = components[key];

    return prev;
  }, {});
}

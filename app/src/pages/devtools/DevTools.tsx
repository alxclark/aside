import {
  RemoteRenderer,
  createController,
  createRemoteReceiver,
} from '@remote-ui/react/host';
import {createEndpoint} from '@remote-ui/rpc';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  BackgroundApiForDevTools,
  DevToolsApi,
  fromPort,
} from '@aside/extension';
import {AllComponents as ChromeUIComponents} from '@aside/chrome-ui/react';

import {setupDebug} from '../../foundation/Debug';

import '@aside/chrome-ui/css';
import {Runtime} from 'webextension-polyfill';

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
  useEffect(() => {
    console.log('Mount BrowserExtensionRenderer');
  }, []);

  console.log('Render BrowserExtensionRenderer 1');

  const controller = useMemo(
    () =>
      createController({
        ...prefixComponents(ChromeUIComponents, 'ChromeUI'),
      }),
    [],
  );
  const [receiver, setReceiver] = useState(createRemoteReceiver());
  const [port, setPort] = useState<Runtime.Port | undefined>();

  console.log({port, receiver});

  useEffect(() => {
    const activeTab = browser.devtools.inspectedWindow.tabId;

    // Attempt a connection in case content-script already loaded and can intercept the port.
    const contentScriptPort = browser.runtime.connect({
      name: `${browser.devtools.inspectedWindow.tabId}`,
    });

    // Wait to receive a message from content-script accepting to use the port.
    contentScriptPort.onMessage.addListener(onAcceptedPortListener);

    // In case devtools loads first, we listen for content-script connection.
    // Once content-script connect, we will accept the port sent.
    browser.runtime.onConnect.addListener(onConnectListener);

    function onAcceptedPortListener(message: any, port: Runtime.Port) {
      if (
        message?.type === 'accept-port' &&
        message?.sender === 'content-script'
      ) {
        console.log('[dev] Agreed to use the new dev port');
        setPort(port);
      }
    }

    function onConnectListener(port: Runtime.Port) {
      if (activeTab !== port.sender?.tab?.id) {
        console.log('[dev] Refused to use new CS port');
        return;
      }

      port.postMessage({type: 'accept-port', sender: 'dev'});
      console.log('[dev] Agreed to use the new CS port');

      // Set a fresh receiver,
      // since the connect listener will be called on page reload once the dev tools is loaded.
      setReceiver(createRemoteReceiver());
      setPort(port);
    }

    return () => {
      contentScriptPort.onMessage.removeListener(onAcceptedPortListener);
      browser.runtime.onConnect.removeListener(onConnectListener);
    };
  }, []);

  useEffect(() => {
    if (!port) return;

    const contentScript = createEndpoint<any>(fromPort(port), {
      callable: ['getDevToolsChannel', 'log', 'renewReceiver', 'mountDevTools'],
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
  }, [receiver, port]);

  useEffect(() => {
    if (!port) return;

    function listener() {
      setPort(undefined);
    }

    port.onDisconnect.addListener(listener);

    return () => {
      port.onDisconnect.removeListener(listener);
    };
  }, [port]);

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

import {
  RemoteRenderer,
  createController,
  createRemoteReceiver,
} from '@remote-ui/react/host';
import {Endpoint, createEndpoint} from '@remote-ui/rpc';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  ContentScriptApiForDevTools,
  DevToolsApiForContentScript,
} from '@aside/core';
import {
  AllComponents as ChromeUIComponents,
  Text,
  View,
  Link,
  Icon,
} from '@aside/chrome-ui/react';
import {Runtime} from 'webextension-polyfill';
import '@aside/chrome-ui/css';

import {useNetworkApi} from '../../foundation/api';
import {createUnsafeEncoder, fromPort} from '../../foundation/Remote';

export function BrowserExtensionRenderer() {
  const controller = useMemo(
    () =>
      createController({
        ...prefixComponents(ChromeUIComponents, 'ChromeUI'),
      }),
    [],
  );
  const [receiver, setReceiver] = useState(createRemoteReceiver());
  const [port, setPort] = useState<Runtime.Port | undefined>();
  const [connected, setConnected] = useState(false);
  const endpointRef =
    useRef<Endpoint<ContentScriptApiForDevTools | undefined>>();

  const network = useNetworkApi();

  useEffect(() => {
    const listener = () => {
      port?.disconnect();
    };
    window.addEventListener('beforeunload', listener);

    return () => {
      window.removeEventListener('beforeunload', listener);
    };
  }, [port]);

  useEffect(() => {
    const activeTab = browser.devtools.inspectedWindow.tabId;

    // Attempt a connection in case content-script already loaded and can intercept the port.
    const contentScriptPort = browser.tabs.connect(
      browser.devtools.inspectedWindow.tabId,
      {name: 'dev'},
    );

    // Wait to receive a message from content-script accepting to use the port.
    contentScriptPort.onMessage.addListener(onAcceptedPortListener);

    // In case devtools loads first, we listen for content-script connection.
    // Once content-script connect, we will accept the port sent.
    browser.runtime.onConnect.addListener(onConnectListener);

    function onAcceptedPortListener(message: any, port: Runtime.Port) {
      // console.log('Received message from CS', message);
      if (
        message?.type === 'accept-port' &&
        message?.sender === 'content-script'
      ) {
        setPort(port);
      }
    }

    function onConnectListener(port: Runtime.Port) {
      if (activeTab !== port.sender?.tab?.id) {
        return;
      }

      port.postMessage({type: 'accept-port', sender: 'dev'});

      // Set a fresh receiver,
      // since the connect listener will be called on page reload once the dev tools is loaded.
      setReceiver(createRemoteReceiver());
      setPort(port);
    }

    return () => {
      contentScriptPort.onMessage.removeListener(onAcceptedPortListener);
      browser.runtime.onConnect.removeListener(onConnectListener);
    };
  }, [network]);

  useEffect(() => {
    port?.onDisconnect.addListener(() => {
      console.log('disconnected port');
      network.reset();
    });
  }, [network, port?.onDisconnect]);

  useEffect(() => {
    if (!port) return;

    const contentScript = createEndpoint<ContentScriptApiForDevTools>(
      fromPort(port),
      {
        createEncoder: createUnsafeEncoder,
        callable: [
          'getDevToolsChannel',
          'log',
          'renewReceiver',
          'mountDevTools',
          'getApi',
        ],
      },
    );

    const devToolsApi: DevToolsApiForContentScript = {
      getDevToolsChannel() {
        return receiver.receive;
      },
      renewReceiver() {
        setReceiver(createRemoteReceiver());
      },
      getApi() {
        return {
          network: network.api,
        };
      },
    };

    contentScript.expose(devToolsApi);
    endpointRef.current = contentScript;

    port.postMessage({sender: 'dev', type: 'ready'});
  }, [receiver, port, network.api]);

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

  useEffect(() => {
    if (receiver.attached.root.children.length > 0) {
      setConnected(true);
    }
  }, [receiver.attached.root.children.length]);

  if (!connected) {
    return (
      <View className="p-2 h-full">
        <View className="flex h-full justify-center items-center flex-col gap-2">
          <Icon source="power-off" size="lg" variant="subdued" />
          <Text align="center">This website is not connected to Aside.</Text>
          <Text align="center">
            Learn how to integrate your application at{' '}
            <Link to="https://github.com/alxclark/aside">
              https://github.com/alxclark/aside
            </Link>
            .
          </Text>
        </View>
      </View>
    );
  }

  return <RemoteRenderer receiver={receiver} controller={controller} />;
}

export function DevTools() {
  return (
    <div className="aside h-full">
      <BrowserExtensionRenderer />
    </div>
  );
}

function prefixComponents(components: {[key: string]: any}, prefix: string) {
  return Object.keys(components).reduce<{[key: string]: any}>((prev, key) => {
    const prefixedKey = prefix + key;
    prev[prefixedKey] = components[key];

    return prev;
  }, {});
}

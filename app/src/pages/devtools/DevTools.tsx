import {
  RemoteRenderer,
  createController,
  createRemoteReceiver,
} from '@remote-ui/react/host';
import {createEndpoint} from '@remote-ui/rpc';
import React, {useEffect, useMemo, useState} from 'react';
import {
  ContentScriptApiForDevTools,
  DevToolsApiForContentScript,
  NetworkRequest,
  fromPort,
} from '@aside/extension';
import {
  AllComponents as ChromeUIComponents,
  Flex,
  Text,
  View,
  Link,
  Icon,
} from '@aside/chrome-ui/react';
import {Runtime} from 'webextension-polyfill';
import '@aside/chrome-ui/css';

import {useRemoteSubscribable} from '../../utilities/subscription';

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
  const [networkRequests, setNetworkRequests] = useState<NetworkRequest[]>([]);
  const [connected, setConnected] = useState(false);

  const {subscribable: requests, clear: clearRequestsSubscribable} =
    useRemoteSubscribable(networkRequests);

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
      console.log('Received message from CS', message);
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
      clearRequestsSubscribable();
    }

    return () => {
      contentScriptPort.onMessage.removeListener(onAcceptedPortListener);
      browser.runtime.onConnect.removeListener(onConnectListener);
    };
  }, [clearRequestsSubscribable]);

  useEffect(() => {
    const listener = async (request: any) => {
      setNetworkRequests((prev) => {
        return [
          ...prev,
          {
            type: request._resourceType,
            time: request.time,
            request: {url: request.request.url},
          },
        ];
      });
    };

    browser.devtools.network.onRequestFinished.addListener(listener);

    return () =>
      browser.devtools.network.onRequestFinished.removeListener(listener);
  }, []);

  useEffect(() => {
    if (!port) return;

    const contentScript = createEndpoint<ContentScriptApiForDevTools>(
      fromPort(port),
      {
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
          network: {
            requests,
          },
        };
      },
    };

    contentScript.expose(devToolsApi);

    port.postMessage({sender: 'dev', type: 'ready'});
  }, [receiver, port, requests]);

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
      <View padding={10} fullHeight>
        <Flex
          fullHeight
          justifyContent="center"
          alignItems="center"
          direction="column"
          gap="10px"
        >
          <Icon source="power-off" height={80} color="icon-subdued" />
          <Text align="center">This website is not connected to Aside.</Text>
          <Text align="center">
            Learn how to integrate your application at{' '}
            <Link to="https://github.com/alxclark/aside">
              https://github.com/alxclark/aside
            </Link>
            .
          </Text>
        </Flex>
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

import {
  RemoteRenderer,
  createController,
  createRemoteReceiver,
} from '@remote-ui/react/host';
import {Endpoint, createEndpoint} from '@remote-ui/rpc';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  ContentScriptApiForDevtools,
  DevtoolsApiForContentScript,
  StatelessExtensionApi,
} from '@aside/core';
import {Runtime} from 'webextension-polyfill';

import {useApi} from '../../foundation/api';
import {createUnsafeEncoder, fromPort} from '../../foundation/Remote';
import {COMPONENTS} from '../../foundation/ui';

import {NotConnected} from './components';

export function Host() {
  const controller = useMemo(() => createController(COMPONENTS), []);
  const [receiver, setReceiver] = useState(createRemoteReceiver());
  const [port, setPort] = useState<Runtime.Port | undefined>();
  const contentScriptEndpointRef =
    useRef<Endpoint<ContentScriptApiForDevtools | undefined>>();
  const hostCleanupRef = useRef<() => void | undefined>();
  const [connected, setConnected] = useState(false);

  const hostApi = useApi();

  useEffect(() => {
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
      if (
        message?.type === 'accept-port' &&
        message?.sender === 'content-script'
      ) {
        setPort(port);
      }
    }

    function onConnectListener(port: Runtime.Port) {
      if (browser.devtools.inspectedWindow.tabId !== port.sender?.tab?.id) {
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
  }, []);

  useEffect(() => {
    if (!port) return;

    const contentScript = createEndpoint<ContentScriptApiForDevtools>(
      fromPort(port),
      {
        createEncoder: createUnsafeEncoder,
        callable: ['getRemoteChannel', 'log', 'mountDevtools', 'getApi'],
      },
    );

    const devToolsApi: DevtoolsApiForContentScript = {
      getRemoteChannel() {
        // If a webpage requests a remote channel,
        // we know that it's attempting to connect and we can render the remote renderer.
        setConnected(true);
        return receiver.receive;
      },
      async getApi(options = {}) {
        const {capabilities} = options;

        // Cleanup previous host api
        hostCleanupRef.current?.();

        // Api could be cached based on a session identifier being passed to the host.
        // For simplicity now, always recreate.
        const [statelessApi, cleanup] = await hostApi.api({
          capabilities,
        });

        // eslint-disable-next-line require-atomic-updates
        hostCleanupRef.current = cleanup;

        // When passing the api over RPC it will wrap functions in proxies (function return wrapped in promise).
        return statelessApi as StatelessExtensionApi;
      },
    };

    contentScript.expose(devToolsApi);
    contentScriptEndpointRef.current = contentScript;

    port.postMessage({sender: 'dev', type: 'ready'});
  }, [receiver, port, hostApi]);

  useEffect(() => {
    if (!port) return;

    function listener() {
      setPort(undefined);
    }

    port.onDisconnect.addListener(listener);

    return () => {
      port.onDisconnect.removeListener(listener);
      hostCleanupRef.current?.();
    };
  }, [hostApi, port]);

  if (!connected) {
    return <NotConnected />;
  }

  return <RemoteRenderer receiver={receiver} controller={controller} />;
}

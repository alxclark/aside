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
  const [api, resetApi] = useApi();

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
        return receiver.receive;
      },
      getApi() {
        return api;
      },
    };

    contentScript.expose(devToolsApi);
    contentScriptEndpointRef.current = contentScript;

    port.postMessage({sender: 'dev', type: 'ready'});
  }, [receiver, port, api]);

  useEffect(() => {
    if (!port) return;

    function listener() {
      setPort(undefined);
      resetApi();
    }

    port.onDisconnect.addListener(listener);

    return () => {
      port.onDisconnect.removeListener(listener);
    };
  }, [port, resetApi]);

  if (receiver.state === 'unmounted') {
    return <NotConnected />;
  }

  return <RemoteRenderer receiver={receiver} controller={controller} />;
}

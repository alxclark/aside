import {createEndpoint, Endpoint} from '@remote-ui/rpc';
import {
  BackgroundApiForContentScript,
  ContentScriptApiForWebpage,
  fromPort,
  fromContentScript,
} from '@aside/extension';
import type {WebpageApi} from '@aside/web';
import {createUnsafeEncoder} from '@aside/core';
import {Runtime} from 'webextension-polyfill';

interface Current {
  webpage?: Endpoint<WebpageApi>;
  devtools?: Endpoint<BackgroundApiForContentScript>;
  port?: Runtime.Port;
}

(() => {
  const current: Current = {};

  // Attempt a connection in case Devtools already loaded and can intercept the port.
  const contentScriptPort = browser.runtime.connect({name: 'content-script'});
  // Wait to receive a message from devtools accepting to use the port.
  contentScriptPort.onMessage.addListener(onAcceptedPortListener);

  // In case content-script loads first, we listen for devtools connection.
  // Once devtools connect, we will accept the port sent.
  browser.runtime.onConnect.addListener(onConnectListener);

  function onAcceptedPortListener(message: any, port: Runtime.Port) {
    if (message?.type === 'accept-port' && message?.sender === 'dev') {
      setup(port);
    }
  }

  async function onConnectListener(port: Runtime.Port) {
    port.postMessage({type: 'accept-port', sender: 'content-script'});
    setup(port);
  }

  async function setup(port: Runtime.Port) {
    // Unmount the client side remote-components.
    // This wipes the devtools UI completely.
    try {
      await current.webpage?.call.unmountDevTools();
    } catch (error) {
      console.log('webpage terminate failed');
    }

    // Create a brand new devtools endpoint
    const devtools = createDevtoolsEndpoint(port);

    // Use the same webpage endpoint or create a new one if there's none.
    const webpage = current.webpage ?? createWebpageEndpoint();

    // Even if the webpage already existed, the methods exposed to the webpage
    // depend on the new dev tools endpoint, so we need to re-expose all methods anyway.
    exposeWebpage(webpage, devtools);
    exposeDevtools(devtools, webpage);

    port.onDisconnect.addListener(() => {
      if (current.port === port) {
        current.port = undefined;
      }
      current.webpage?.call.unmountDevTools();
    });

    current.devtools = devtools;
    current.webpage = webpage;
    current.port = port;

    // TODO: Fix a timing issue when webpage attempts to request the devtools for a new RPC channel
    // and the request is never answered by the devtools because its not ready in time.
    setTimeout(() => {
      webpage.call.mountDevTools();
    }, 250);
  }
})();

function createDevtoolsEndpoint(port: Runtime.Port) {
  return createEndpoint<BackgroundApiForContentScript>(fromPort(port), {
    callable: ['getDevToolsChannel'],
  });
}

function createWebpageEndpoint() {
  return createEndpoint<WebpageApi>(fromContentScript({to: 'webpage'}), {
    callable: ['mountDevTools', 'unmountDevTools', 'log', 'resetChannel'],
    createEncoder: createUnsafeEncoder,
  });
}

function exposeWebpage(
  webpage: Endpoint<WebpageApi>,
  devtools: Endpoint<BackgroundApiForContentScript>,
) {
  const contentScriptApiForWebpage: ContentScriptApiForWebpage = {
    getDevToolsChannel() {
      return devtools.call.getDevToolsChannel();
    },
  };

  webpage.expose(contentScriptApiForWebpage);
}

function exposeDevtools(
  devtools: Endpoint<BackgroundApiForContentScript>,
  webpage: Endpoint<WebpageApi>,
) {
  const contentScriptApiForDevtools: any = {
    mountDevTools() {
      return webpage.call.mountDevTools();
    },
    unmountDevTools() {
      return webpage.call.unmountDevTools();
    },
    log(source, ...params) {
      return webpage.call.log(source, ...params);
    },
  };

  devtools.expose(contentScriptApiForDevtools);
}

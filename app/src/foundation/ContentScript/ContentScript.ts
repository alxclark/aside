import {createEndpoint, retain} from '@remote-ui/rpc';
import type {Endpoint} from '@remote-ui/rpc';
import {
  ContentScriptApiForWebpage,
  ContentScriptApiForDevtools,
  DevtoolsApiForContentScript,
  fromWebpage,
  WebpageApi,
} from '@aside/core';
import {Runtime} from 'webextension-polyfill';

import {createUnsafeEncoder} from '../Remote';
import {fromPort} from '../Remote/rpc';

interface Current {
  webpage?: Endpoint<WebpageApi>;
  devtools?: Endpoint<DevtoolsApiForContentScript>;
  port?: Runtime.Port;
}

export function contentScript() {
  const current: Current = {};

  // Attempt a connection in case Devtools already loaded and can intercept the port.
  const contentScriptPort = browser.runtime.connect({name: 'content-script'});
  // Wait to receive a message from devtools accepting to use the port.
  contentScriptPort.onMessage.addListener(onAcceptedPortListener);

  // In case content-script loads first, we listen for devtools connection.
  // Once devtools connect, we will accept the port sent.
  browser.runtime.onConnect.addListener(onConnectListener);

  async function onAcceptedPortListener(message: any, port: Runtime.Port) {
    if (message?.type === 'accept-port' && message?.sender === 'dev') {
      return setup(port);
    }
  }

  async function onConnectListener(port: Runtime.Port) {
    port.postMessage({type: 'accept-port', sender: 'content-script'});

    const listener = (message: any) => {
      if (message.type === 'ready' && message.sender === 'dev') {
        setup(port);
      }
    };
    port.onMessage.addListener(listener);
  }

  async function setup(port: Runtime.Port) {
    // Unmount the client side remote-components.
    // This wipes the devtools UI completely.
    try {
      await current.webpage?.call.unmountDevtools();
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
      current.webpage?.call.unmountDevtools();
    });

    current.devtools = devtools;
    current.webpage = webpage;
    current.port = port;

    webpage.call.mountDevtools();
  }
}

function createDevtoolsEndpoint(port: Runtime.Port) {
  return createEndpoint<DevtoolsApiForContentScript>(fromPort(port), {
    callable: ['getRemoteChannel', 'getApi'],
  });
}

function createWebpageEndpoint() {
  return createEndpoint<WebpageApi>(fromWebpage({context: 'content-script'}), {
    callable: ['mountDevtools', 'unmountDevtools', 'log'],
    createEncoder: createUnsafeEncoder,
  });
}

function exposeWebpage(
  webpage: Endpoint<WebpageApi>,
  devtools: Endpoint<DevtoolsApiForContentScript>,
) {
  const contentScriptApiForWebpage: ContentScriptApiForWebpage = {
    async getRemoteChannel() {
      return devtools.call.getRemoteChannel();
    },
    getLocalStorage(keys) {
      return browser.storage.local.get(keys);
    },
    setLocalStorage(items) {
      return browser.storage.local.set(items);
    },
    async getApi() {
      const api = await devtools.call.getApi();
      retain(api);

      return api;
    },
  };

  webpage.expose(contentScriptApiForWebpage);
}

function exposeDevtools(
  devtools: Endpoint<DevtoolsApiForContentScript>,
  webpage: Endpoint<WebpageApi>,
) {
  const contentScriptApiForDevtools: ContentScriptApiForDevtools = {
    mountDevtools() {
      return webpage.call.mountDevtools();
    },
    unmountDevtools() {
      return webpage.call.unmountDevtools();
    },
    log(source, ...params) {
      return webpage.call.log(source, ...params);
    },
  };

  devtools.expose(contentScriptApiForDevtools);
}

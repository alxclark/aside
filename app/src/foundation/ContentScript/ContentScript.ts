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

  setup({devtoolsPort: undefined});

  browser.runtime.onConnect.addListener(onConnectListener);

  const contentScriptPort = browser.runtime.connect({
    name: 'content-script',
  });
  contentScriptPort.onMessage.addListener(onAcceptedPortListener);

  async function onAcceptedPortListener(
    message: any,
    devtoolsPort: Runtime.Port,
  ) {
    if (message?.type === 'accept-port' && message?.sender === 'dev') {
      return setup({devtoolsPort});
    }
  }

  async function onConnectListener(devtoolsPort: Runtime.Port) {
    devtoolsPort.postMessage({type: 'accept-port', sender: 'content-script'});

    const listener = (message: any) => {
      if (message.type === 'ready' && message.sender === 'dev') {
        setup({devtoolsPort});
      }
    };
    devtoolsPort.onMessage.addListener(listener);
  }

  async function setup({devtoolsPort}: {devtoolsPort?: Runtime.Port}) {
    try {
      await current.webpage?.call.unmountDevtools();
    } catch (error) {
      console.log('webpage terminate failed');
    }

    if (devtoolsPort) {
      // Create a brand new devtools endpoint
      const devtools = createDevtoolsEndpoint(devtoolsPort);

      // Use the same webpage endpoint or create a new one if there's none.
      const webpage = current.webpage ?? createWebpageEndpoint();

      // Even if the webpage already existed, the methods exposed to the webpage
      // depend on the new dev tools endpoint, so we need to re-expose all methods anyway.
      exposeWebpage(webpage, devtools);
      exposeDevtools(devtools, webpage);

      devtoolsPort.onDisconnect.addListener(() => {
        if (current.port === devtoolsPort) {
          current.port = undefined;
        }
        current.webpage?.call.unmountDevtools();
      });

      current.devtools = devtools;
      current.webpage = webpage;
      current.port = devtoolsPort;

      webpage.call.mountDevtools();
    } else {
      const webpage = current.webpage ?? createWebpageEndpoint();
      exposeWebpage(webpage);
      current.webpage = webpage;
    }
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

let channelPromiseResolve: any;

function exposeWebpage(
  webpage: Endpoint<WebpageApi>,
  devtools?: Endpoint<DevtoolsApiForContentScript>,
) {
  console.log({channelPromiseResolve, devtools});
  if (channelPromiseResolve && devtools) {
    console.log('returned the channel promise');
    devtools.call
      .getRemoteChannel()
      .then(channelPromiseResolve)
      .catch(() => console.error('Could not return a channel promise'));

    channelPromiseResolve = undefined;
  }

  const contentScriptApiForWebpage: ContentScriptApiForWebpage = {
    async getRemoteChannel() {
      browser.runtime.sendMessage({type: 'mount'});

      if (!devtools) {
        return new Promise((resolve) => {
          channelPromiseResolve = resolve;
        });
      }

      return devtools.call.getRemoteChannel();
    },
    getLocalStorage(keys) {
      return browser.storage.local.get(keys);
    },
    setLocalStorage(items) {
      return browser.storage.local.set(items);
    },
    async getApi() {
      if (!devtools) {
        throw new Error('Cannot get api since no devtools is connected');
      }

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

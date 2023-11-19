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
import {type RemoteChannel} from '@remote-ui/core';

import {createUnsafeEncoder} from '../Remote';
import {fromPort} from '../Remote/rpc';

import {WEBPAGE_INITIATED_CONNECTION} from './messages';

interface Current {
  webpage?: Endpoint<WebpageApi>;
  devtools?: Endpoint<DevtoolsApiForContentScript>;
  port?: Runtime.Port;
}

export function contentScript() {
  // Case 1:
  // The webpage remote loads and expose methods before the content-script
  // Case 2:
  // The content-script loads before the remote is ready
  // Case 3:
  // The devtools loads ahead of the content-script and webpage

  let state: State = {
    devtools: {
      ready: false,
    },
    webpage: {
      ready: false,
      endpoint: createWebpageEndpoint(),
    },
  };

  const contentScriptPort = browser.runtime.connect({
    name: 'content-script',
  });

  contentScriptPort.onMessage.addListener(onAcceptedPortListener);
  async function onAcceptedPortListener(
    message: any,
    devtoolsPort: Runtime.Port,
  ) {
    if (message?.type === 'accept-port' && message?.sender === 'dev') {
      state = reducer(state, {type: 'devtools-ready', port: devtoolsPort});

      devtoolsPort.onDisconnect.addListener(() => {
        state = reducer(state, {
          type: 'devtools-disconnected',
          port: devtoolsPort,
        });
      });
    }
  }

  browser.runtime.onConnect.addListener(onConnectListener);
  async function onConnectListener(devtoolsPort: Runtime.Port) {
    devtoolsPort.postMessage({type: 'accept-port', sender: 'content-script'});

    const listener = (message: any) => {
      if (message.type === 'ready' && message.sender === 'dev') {
        state = reducer(state, {type: 'devtools-ready', port: devtoolsPort});

        devtoolsPort.onDisconnect.addListener(() => {
          state = reducer(state, {
            type: 'devtools-disconnected',
            port: devtoolsPort,
          });
        });
      }
    };
    devtoolsPort.onMessage.addListener(listener);
  }
}

interface State {
  webpage: {
    ready: boolean;
    endpoint: Endpoint<WebpageApi>;
  };
  devtools: {
    ready: boolean;
    endpoint?: Endpoint<DevtoolsApiForContentScript>;
    port?: Runtime.Port;
  };
}

type Action =
  | {type: 'webpage-ready'}
  | {type: 'devtools-ready'; port: Runtime.Port}
  | {type: 'devtools-disconnected'; port: Runtime.Port};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'webpage-ready': {
      if (state.webpage.ready) return state;

      exposeWebpage(state.webpage.endpoint, state.devtools.endpoint);

      return {
        ...state,
        webpage: {
          ...state.webpage,
          ready: true,
        },
      };
    }
    case 'devtools-ready': {
      // Might need to catch when devtools reload and let this through
      // For reload, will need to make sure to unmount the webpage if it already painted some ui.
      if (state.devtools.ready) return state;
      if (!state.webpage.ready) return state;

      const endpoint = createDevtoolsEndpoint(action.port);

      // Expose both devtools and webpage methods since both rely on the new port
      exposeDevtools(endpoint, state.webpage.endpoint);
      exposeWebpage(state.webpage.endpoint, state.devtools.endpoint);

      return state;
    }
    case 'devtools-disconnected': {
      if (state.devtools.port !== action.port) return state;

      state.webpage.endpoint?.call.unmountDevtools();

      return {
        ...state,
        devtools: {
          ...state.devtools,
          port: undefined,
          endpoint: undefined,
        },
      };
    }
  }
}

export function contentScript0() {
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
  const endpoint = createEndpoint<WebpageApi>(
    fromWebpage({context: 'content-script'}),
    {
      callable: ['mountDevtools', 'unmountDevtools', 'log'],
      createEncoder: createUnsafeEncoder,
    },
  );

  exposeWebpage(endpoint);

  return endpoint;
}

// When the webpage mounts, it starts requesting a channel from the devtools.
// If the devtools is not yet opened and we can't return the channel from the content-script,
// we return an empty promise and resolve it when the devtools ends up opening.
let channelPromiseResolve:
  | ((value: RemoteChannel | PromiseLike<RemoteChannel>) => void)
  | undefined;

function exposeWebpage(
  webpage: Endpoint<WebpageApi>,
  devtools?: Endpoint<DevtoolsApiForContentScript>,
) {
  if (channelPromiseResolve && devtools) {
    devtools.call
      .getRemoteChannel()
      .then(channelPromiseResolve)
      .catch(() => console.error('Could not return a channel promise'));

    channelPromiseResolve = undefined;
  }

  const contentScriptApiForWebpage: ContentScriptApiForWebpage = {
    showWebpageUsesAside() {
      browser.runtime.sendMessage({type: WEBPAGE_INITIATED_CONNECTION});
    },
    async getRemoteChannel() {
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
    ready() {
      return webpage.call.mountDevtools();
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

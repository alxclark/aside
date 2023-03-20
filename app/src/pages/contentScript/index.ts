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
      const devtools = createDevtoolsEndpoint(port);
      const webpage = createWebpageEndpoint();

      exposeWebpage(webpage, devtools);
      exposeDevtools(devtools, webpage);

      current.devtools = devtools;
      current.webpage = webpage;
      current.port = port;
      webpage.call.mountDevTools();
    }
  }

  async function onConnectListener(port: Runtime.Port) {
    port.postMessage({type: 'accept-port', sender: 'content-script'});

    console.log('new dev tools connection');

    try {
      current.devtools?.terminate();
    } catch (error) {
      console.log('devtools terminate failed');
    }

    try {
      await current.webpage?.call.unmountDevTools();
      current.webpage?.terminate();
    } catch (error) {
      console.log('webpage terminate failed');
    }

    try {
      current.port?.disconnect();
    } catch (error) {
      console.log('port disconnect failed');
    }

    const devtools = createDevtoolsEndpoint(port);
    const webpage = createWebpageEndpoint();

    exposeWebpage(webpage, devtools);
    exposeDevtools(devtools, webpage);

    current.devtools = devtools;
    current.webpage = webpage;
    current.port = port;

    webpage.call.resetChannel();
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

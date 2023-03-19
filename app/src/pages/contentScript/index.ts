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

let count = 0;

(() => {
  let current: {
    webpage?: Endpoint<WebpageApi>;
    devtools?: Endpoint<BackgroundApiForContentScript>;
    port?: Runtime.Port;
  } = {};

  // Attempt a connection in case Devtools already loaded and can intercept the port.
  const contentScriptPort = browser.runtime.connect({name: 'content-script'});
  // Wait to receive a message from devtools accepting to use the port.
  contentScriptPort.onMessage.addListener(onAcceptedPortListener);

  // In case content-script loads first, we listen for devtools connection.
  // Once devtools connect, we will accept the port sent.
  browser.runtime.onConnect.addListener(onConnectListener);

  function onAcceptedPortListener(message: any, port: Runtime.Port) {
    if (message?.type === 'accept-port' && message?.sender === 'dev') {
      const {webpage} = setup(port);

      webpage.call.mountDevTools();
    }
  }

  async function onConnectListener(port: Runtime.Port) {
    port.postMessage({type: 'accept-port', sender: 'content-script'});

    if (current?.webpage) {
      await current.webpage.call.resetChannel();

      try {
        current.devtools?.terminate();
        current.webpage?.terminate();
        current.port?.disconnect();
      } catch (error) {
        console.log('terminating endpoint failed');
      }
    }

    const {webpage} = setup(port);

    webpage.call.mountDevTools();
  }

  function setup(port: Runtime.Port) {
    try {
      const devtools = createEndpoint<BackgroundApiForContentScript>(
        fromPort(port),
        {
          callable: ['getDevToolsChannel'],
        },
      );

      const webpage = createEndpoint<WebpageApi>(
        fromContentScript({to: 'webpage'}),
        {
          callable: ['mountDevTools', 'unmountDevTools', 'log', 'resetChannel'],
          // callable: ['log'],
          createEncoder: createUnsafeEncoder,
        },
      );

      const contentScriptApiForWebpage: ContentScriptApiForWebpage = {
        getDevToolsChannel() {
          return current.devtools?.call.getDevToolsChannel();
        },
      };

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

      webpage.expose(contentScriptApiForWebpage);
      devtools.expose(contentScriptApiForDevtools);

      current = {webpage, devtools, port};
      count++;

      return {webpage, devtools};
    } catch (error) {
      throw new Error(
        'Something happened when setting up the content script',
        error as any,
      );
    }
  }
})();

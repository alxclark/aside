import {createEndpoint} from '@remote-ui/rpc';
import {
  BackgroundApiForContentScript,
  ContentScriptApiForWebpage,
  fromPort,
  fromContentScript,
} from '@aside/extension';
import type {WebpageApi} from '@aside/web';
import {createUnsafeEncoder} from '@aside/core';
import {Runtime} from 'webextension-polyfill';

(() => {
  // Attempt a connection in case Devtools already loaded and can intercept the port.
  const contentScriptPort = browser.runtime.connect({name: 'content-script'});
  // Wait to receive a message from devtools accepting to use the port.
  contentScriptPort.onMessage.addListener(onAcceptedPortListener);

  // In case content-script loads first, we listen for devtools connection.
  // Once devtools connect, we will accept the port sent.
  browser.runtime.onConnect.addListener(onConnectListener);

  function onAcceptedPortListener(message: any, port: Runtime.Port) {
    console.log('5');
    if (message?.type === 'accept-port' && message?.sender === 'dev') {
      console.log('[CS] Agreed to use the new CS port');

      setup(port);
    }
  }

  function onConnectListener(port: Runtime.Port) {
    console.log('6');
    port.postMessage({type: 'accept-port', sender: 'content-script'});
    console.log('[CS] Agreed to use the new dev port');

    setup(port);
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
          return devtools.call.getDevToolsChannel();
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

      webpage.call.resetChannel();

      port.onDisconnect.addListener(() => {
        webpage.terminate();
      });
    } catch (error) {
      throw new Error(
        'Something happened when setting up the content script',
        error as any,
      );
    }
  }
})();

import {createEndpoint} from '@remote-ui/rpc';
import type {
  BackgroundApiForContentScript,
  ContentScriptApiForBackground,
  ContentScriptApiForWebpage,
} from '@aside/extension';
import {fromContentScript, fromContentScriptToDevtools} from '@aside/extension';
import type {WebpageApi} from '@aside/web';
import {createUnsafeEncoder} from '@aside/core';

(() => {
  console.log('injected content script');

  // let portDev: any;
  // const onMessage = (msg: any) => {
  //   console.log('[Content] received message', msg);
  //   portDev.postMessage('bar');
  // };
  // const onDisconnect = () => {
  //   console.log('[Content] disconnected');
  //   portDev = null;
  // };

  // browser.runtime.onMessage.addListener((message, sender) => {
  //   console.log({message});
  // });

  // browser.runtime.onConnect.addListener((port) => {
  //   console.log('[Content] onConnect', {port});
  //   if (port.name !== 'dev') return;
  //   portDev = port;
  //   portDev.onMessage.addListener(onMessage);
  //   portDev.onDisconnect.addListener(onDisconnect);
  // });

  async function setup() {
    try {
      const devtoolsMessenger = await fromContentScriptToDevtools();

      const devtools = createEndpoint<BackgroundApiForContentScript>(
        devtoolsMessenger,
        {
          callable: ['getDevToolsChannel'],
        },
      );

      const webpage = createEndpoint<WebpageApi>(
        fromContentScript({to: 'webpage'}),
        {
          callable: ['mountDevTools', 'unmountDevTools', 'log'],
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
    } catch (error) {
      throw new Error(
        'Something happened when setting up the content script',
        error as any,
      );
    }
  }

  setup();
})();

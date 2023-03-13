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

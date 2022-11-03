import {createEndpoint} from '@remote-ui/rpc';
import type {
  BackgroundApiForContentScript,
  ContentScriptApiForBackground,
  ContentScriptApiForWebpage,
} from '@companion/extension';
import {fromContentScript} from '@companion/extension';
import type {WebpageApi} from '@companion/web';
import {createUnsafeEncoder} from '@companion/core';

(() => {
  window.__companion = {log: () => {}};

  const background = createEndpoint<BackgroundApiForContentScript>(
    fromContentScript({to: 'background'}),
    {
      callable: ['getDevToolsChannel'],
    },
  );

  const webpage = createEndpoint<WebpageApi>(
    fromContentScript({to: 'webpage'}),
    {
      callable: ['mountDevTools', 'unmountDevTools', 'log'],
      createEncoder: createUnsafeEncoder,
    },
  );

  const contentScriptApiForWebpage: ContentScriptApiForWebpage = {
    getDevToolsChannel() {
      return background.call.getDevToolsChannel();
    },
  };

  const ContentScriptApiForBackground: ContentScriptApiForBackground = {
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
  background.expose(ContentScriptApiForBackground);
})();

import {
  WebpageApi,
  DevtoolsApiForContentScript,
  ContentScriptApiForWebpage,
  ContentScriptApiForDevtools,
} from '@aside/core';
import {Endpoint, retain} from '@remote-ui/rpc';
import {type RemoteChannel} from '@remote-ui/core';

import {WEBPAGE_INITIATED_CONNECTION} from './messages';
import {Dispatch} from './types';

// When the webpage mounts, it starts requesting a channel from the devtools.
// If the devtools is not yet opened and we can't return the channel from the content-script,
// we return an empty promise and resolve it when the devtools ends up opening.
let channelPromiseResolve:
  | ((value: RemoteChannel | PromiseLike<RemoteChannel>) => void)
  | undefined;

export function exposeWebpage(
  webpage: Endpoint<WebpageApi>,
  devtools: Endpoint<DevtoolsApiForContentScript> | undefined,
  dispatch: Dispatch,
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
      dispatch({type: 'webpage-ready'});
    },
  };

  webpage.expose(contentScriptApiForWebpage);
}

export function exposeDevtools(
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

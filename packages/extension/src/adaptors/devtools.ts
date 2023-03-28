import {Runtime} from 'webextension-polyfill';
import {MessageEndpoint} from '@remote-ui/rpc';

import {fromPort} from './port';

export async function fromDevTools(): Promise<MessageEndpoint> {
  return new Promise<MessageEndpoint>((resolve) => {
    // Attempt a connection in case content-script already loaded and can intercept the port.
    const port = browser.runtime.connect({
      name: `${browser.devtools.inspectedWindow.tabId}`,
    });
    // Wait to receive a message from content-script accepting to use the port.
    port.onMessage.addListener(onAcceptedPortListener);

    // In case devtools loads first, we listen for content-script connection.
    // Once content-script connect, we will accept the port sent.
    browser.runtime.onConnect.addListener(onConnectListener);

    // TODO: Race against timer and reject if takes too long

    function onAcceptedPortListener(message: any, port: Runtime.Port) {
      if (
        message?.type === 'accept-port' &&
        message?.sender === 'content-script'
      ) {
        resolve(fromPort(port));
        port.onMessage.removeListener(onAcceptedPortListener);
        browser.runtime.onConnect.removeListener(onConnectListener);
      }
    }

    function onConnectListener(port: Runtime.Port) {
      port.postMessage({type: 'accept-port', sender: 'dev'});
      resolve(fromPort(port));
      browser.runtime.onConnect.removeListener(onConnectListener);
      port.onMessage.removeListener(onAcceptedPortListener);
    }
  });
}

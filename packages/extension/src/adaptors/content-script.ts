import {Runtime} from 'webextension-polyfill';
import {fromWebpage} from '@aside/web';
import {MessageEndpoint} from '@remote-ui/rpc';

import {fromPort} from './port';

interface Options {
  to: 'webpage';
}

export function fromContentScript({to}: Options): MessageEndpoint {
  switch (to) {
    case 'webpage':
      return fromWebpage({context: 'content-script'});
  }
}

export function fromContentScriptToDevtools(): Promise<MessageEndpoint> {
  // port.postMessage({
  //   name: 'init',
  // });

  console.log('fromContentScriptToDevtools');

  return new Promise<MessageEndpoint>((resolve, reject) => {
    // Attempt a connection in case Devtools already loaded and can intercept the port.
    console.log('1');
    const port = browser.runtime.connect({name: 'content-script'});
    console.log('2');
    // Wait to receive a message from devtools accepting to use the port.
    port.onMessage.addListener(onAcceptedPortListener);
    console.log('3');

    // In case content-script loads first, we listen for devtools connection.
    // Once devtools connect, we will accept the port sent.
    browser.runtime.onConnect.addListener(onConnectListener);

    console.log('4');

    // TODO: Race against timer and reject if takes too long

    function onAcceptedPortListener(message: any, port: Runtime.Port) {
      console.log('5');
      if (message?.type === 'accept-port' && message?.sender === 'dev') {
        console.log('[CS] Agreed to use the new CS port');
        resolve(fromPort(port));
        port.onMessage.removeListener(onAcceptedPortListener);
        browser.runtime.onConnect.removeListener(onConnectListener);
      }
    }

    function onConnectListener(port: Runtime.Port) {
      console.log('6');
      port.postMessage({type: 'accept-port', sender: 'content-script'});
      console.log('[CS] Agreed to use the new dev port');
      resolve(fromPort(port));
      browser.runtime.onConnect.removeListener(onConnectListener);
      port.onMessage.removeListener(onAcceptedPortListener);
    }
  });
}

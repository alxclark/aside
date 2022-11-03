import {fromWebpage} from '@companion/web';
import {MessageEndpoint} from '@remote-ui/rpc';

import {fromPort} from './port';

interface Options {
  to: 'webpage' | 'background';
}

export function fromContentScript({to}: Options): MessageEndpoint {
  switch (to) {
    case 'webpage':
      return fromWebpage({context: 'content-script'});
    case 'background':
      return fromContentScriptToBackground();
  }
}

export function fromContentScriptToBackground(): MessageEndpoint {
  const port = browser.runtime.connect({name: 'content-script'});

  port.postMessage({
    name: 'init',
  });

  return fromPort(port);
}

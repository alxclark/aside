import {MessageEndpoint} from '@remote-ui/rpc'
import { fromPort } from './port';

export function fromDevTools(): MessageEndpoint {
  const port = browser.runtime.connect({name: "dev-tools"});

  port.postMessage({
    name: 'init',
    tabId: browser.devtools.inspectedWindow.tabId
  });

  return fromPort(port)
}




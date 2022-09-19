import { fromWebpage } from '@companion/web';
import {MessageEndpoint} from '@remote-ui/rpc'

interface Options {
  
}

export function fromDevTools(): MessageEndpoint {
  const port = browser.runtime.connect({name: "dev-tools"});

  port.postMessage({
    name: 'init',
    tabId: browser.devtools.inspectedWindow.tabId
});

  // We need to store the listener, because we wrap it to do some origin checking. Ideally,
  // we’d instead store an `AbortController`, and use its signal to cancel the listeners,
  // but that isn’t widely supported.
  const listenerMap = new WeakMap<
    (event: MessageEvent) => void,
    (event: MessageEvent) => void
  >();

  return {
    postMessage(message) {
      port.postMessage(message);
    },
    addEventListener(_event, listener) {
      const wrappedListener = (event: MessageEvent) => {
        listener(event);
      };

      listenerMap.set(listener, wrappedListener);
      port.onMessage.addListener(listener)
    },
    removeEventListener(event, listener) {
      const wrappedListener = listenerMap.get(listener);
      if (wrappedListener == null) return;

      listenerMap.delete(listener);
      self.removeEventListener(event, wrappedListener);
    },
  };
}




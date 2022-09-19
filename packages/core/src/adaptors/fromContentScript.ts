import {MessageEndpoint} from '@remote-ui/rpc'
import { fromWebpage } from './fromWebpage';

interface Options {
  to: 'webpage' | 'background' | 'devtools'
}

export function fromContentScript({to}: Options): MessageEndpoint {
  switch(to) {
    case 'webpage':
      return fromWebpage({context: 'contentScript'})
    case 'background':
    default:
      return fromContentScriptToBackground();
  }
}

export function fromContentScriptToBackground(): MessageEndpoint {
  return
  const port = browser.runtime.connect({name: "content-script"});

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
    addEventListener(event, listener) {
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




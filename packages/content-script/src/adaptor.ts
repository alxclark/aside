import { fromWebpage } from '@companion/web';
import {MessageEndpoint} from '@remote-ui/rpc'

interface Options {
  to: 'webpage' | 'background'
}

export function fromContentScript({to}: Options): MessageEndpoint {
  switch(to) {
    case 'webpage':
      return fromWebpage({context: 'content-script'})
    case 'background':
      return fromContentScriptToBackground();
  }
}

export function fromContentScriptToBackground(): MessageEndpoint {
  const port = browser.runtime.connect({name: "content-script"});

  port.postMessage({
    name: 'init',
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
      const wrappedListener = (message: any) => {
        const messageEvent = new MessageEvent('message', {data: message})
        listener(messageEvent);
      };

      listenerMap.set(listener, wrappedListener);
      port.onMessage.addListener(wrappedListener)
    },
    removeEventListener(event, listener) {
      const wrappedListener = listenerMap.get(listener);
      if (wrappedListener == null) return;

      listenerMap.delete(listener);
      self.removeEventListener(event, wrappedListener);
    },
  };
}
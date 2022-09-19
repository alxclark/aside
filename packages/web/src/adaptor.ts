import {MessageEndpoint} from '@remote-ui/rpc'

interface Options {
  targetOrigin?: string;
  context: string;
}

export function fromWebpage({targetOrigin = '*', context}: Options): MessageEndpoint {
  // We need to store the listener, because we wrap it to do some origin checking. Ideally,
  // we’d instead store an `AbortController`, and use its signal to cancel the listeners,
  // but that isn’t widely supported.
  const listenerMap = new WeakMap<
    (event: MessageEvent) => void,
    (event: MessageEvent) => void
  >();

  return {
    postMessage(message, transfer) {
      if(Array.isArray(message)) {
        message.push({from: context})
      } else {
        console.error('message is not an array')
      }

      window.postMessage(message, targetOrigin, transfer);
    },
    addEventListener(event, listener) {
      const wrappedListener = (event: MessageEvent) => {
        if (event.source !== window) return;

        const last = event.data[event.data.length - 1]

        if(last?.from) {
          event.data.pop();
        }

        if(last?.from === context || !last?.from) return;

        listener(event);
      };

      listenerMap.set(listener, wrappedListener);
      self.addEventListener(event, wrappedListener);
    },
    removeEventListener(event, listener) {
      const wrappedListener = listenerMap.get(listener);
      if (wrappedListener == null) return;

      listenerMap.delete(listener);
      self.removeEventListener(event, wrappedListener);
    },
  };
}
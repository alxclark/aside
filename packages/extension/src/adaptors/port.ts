import {MessageEndpoint} from '@remote-ui/rpc';
import type {Runtime} from 'webextension-polyfill';

export function fromPort(port: Runtime.Port): MessageEndpoint {
  // We need to store the listener, because we wrap it to do some origin checking. Ideally,
  // we’d instead store an `AbortController`, and use its signal to cancel the listeners,
  // but that isn’t widely supported.
  const listenerMap = new WeakMap<
    (event: MessageEvent) => void,
    (event: MessageEvent) => void
  >();

  return {
    postMessage(message) {
      try {
        port.postMessage(message);
      } catch (error) {
        console.log(error);
      }
    },
    addEventListener(_event, listener) {
      const wrappedListener = (message: any) => {
        const messageEvent = new MessageEvent('message', {data: message});
        listener(messageEvent);
      };

      listenerMap.set(listener, wrappedListener);
      port.onMessage.addListener(wrappedListener);
    },
    removeEventListener(event, listener) {
      const wrappedListener = listenerMap.get(listener);
      if (wrappedListener == null) return;

      listenerMap.delete(listener);
      self.removeEventListener(event, wrappedListener);
    },
  };
}

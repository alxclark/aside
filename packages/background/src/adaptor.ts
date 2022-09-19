import {MessageEndpoint} from '@remote-ui/rpc'
import type {Runtime} from 'webextension-polyfill'

interface Options {
  to: 'content-script' | 'dev-tools',
  port: Runtime.Port
}

export function fromBackground({to, port}: Options): MessageEndpoint {
  switch(to) {
    case 'content-script':
      return fromPort({port})
    case 'dev-tools':
      return fromPort({port});
  }
}

export function fromPort({port}: {port: Runtime.Port}): MessageEndpoint {
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

export function fromContentScriptToDevTools(): MessageEndpoint {
  const port = browser.runtime.connect({name: "content-to-dev-tools"});

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


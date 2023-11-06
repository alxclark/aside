/* eslint-disable node/no-unsupported-features/node-builtins */
import {type MessageEndpoint} from '@remote-ui/rpc';

export interface Options {
  targetOrigin?: string;
  context: string;
}

export function fromWebpage({
  targetOrigin = '*',
  context,
}: Options): MessageEndpoint {
  // We need to store the listener, because we wrap it to do some origin checking. Ideally,
  // we’d instead store an `AbortController`, and use its signal to cancel the listeners,
  // but that isn’t widely supported.
  const listenerMap = new WeakMap<
    (event: MessageEvent) => void,
    (event: MessageEvent) => void
  >();

  return {
    postMessage(message, transfer) {
      if (Array.isArray(message)) {
        message.push({from: context});
      } else {
        console.error('message is not an array');
      }

      window.postMessage(message, targetOrigin, transfer);
    },
    addEventListener(event, listener) {
      const wrappedListener = (event: MessageEvent) => {
        if (event.source !== window) return;

        const last = event.data[event.data.length - 1];

        if (last?.from) {
          event.data.pop();
        }

        if (last?.from === context || !last?.from) return;

        // Use to debug
        // eslint-disable-next-line no-constant-condition
        if (false) {
          console.groupCollapsed(`[${context}]`, idToString(event.data?.[0]));
          console.log(event.data?.[1]);
          console.groupEnd();
        }

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

function idToString(something: unknown) {
  if (typeof something === 'number') {
    switch (something) {
      case 0:
        return 'CALL';
      case 1:
        return 'RESULT';
      case 2:
        return 'TERMINATE';
      case 3:
        return 'RELEASE';
      case 5:
        return 'FUNCTION_APPLY';
      case 6:
        return 'FUNCTION_RESULT';
    }
  }
  return something;
}

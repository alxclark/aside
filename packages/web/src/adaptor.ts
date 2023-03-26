import {MessageEndpoint} from '@remote-ui/rpc';

interface Options {
  targetOrigin?: string;
  context: string;
}

let count = 0;

export function fromWebpage({
  targetOrigin = '*',
  context,
}: Options): MessageEndpoint {
  const id = count++;

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

        console.groupCollapsed(`[${context}]`, idToString(event.data?.[0]));
        console.log(event.data?.[1]);
        console.groupEnd();
        try {
          listener(event);
        } catch (error) {
          console.log('whats up gee');
        }
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

export const CALL = 0;
export const RESULT = 1;
export const TERMINATE = 2;
export const RELEASE = 3;
export const FUNCTION_APPLY = 5;
export const FUNCTION_RESULT = 6;

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

// ON RENDER -----
// Apply (5) is what usually the CS will send to devtools with the whole React tree

// ON STATE CHANGE -------
// Apply (5) sends the diff of React tree (ie currentState)
// Sent from content-script to Dev tools

// ON RELOAD -----
// 1. CS receives new connection from devtools
// 2. CS calls rpc.unmount
// 3. Content script tries to apply (5) onto the same ID that was used before the reload
// [2, undefined, 0] ?
// 4. CS releases ID used before reload (seems like a problem)
// 5. Webpage calls rpc.mountDevTools (???)
// 6. ERROR: Webpage receives function result (6) from RPC for (3.) and the function was already revoked
// 7. CS tries to ask devtools for an RPC channel
// 8. ERROR: CS receives result from (5.): Attempted to call a function that was already revoked
// 9. Webpage receives channel from CS and devtools
// 10. CS applies (5) the React tree with 100% of the UI from the client (full tree remount) => tries to use the previous channel
// 11. Webpage receives ok from renderer.

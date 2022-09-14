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
        message.push({context})
      } else {
        console.error('message is not an array')
      }

      // console.log({message})
      window.postMessage(message, targetOrigin, transfer);
    },
    addEventListener(event, listener) {
      const wrappedListener = (event: MessageEvent) => {
        if (event.source !== window) return;
        // console.log({eventData: event.data})

        const last = event.data[event.data.length - 1]

        if(last?.context) {
          // console.log(last.context)
          event.data.pop();
          // console.log(event)
        }

        if(last?.context === context) return;

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
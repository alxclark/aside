import {SetStateActionWithProxy, SetStateProxy} from '@aside/core';
import {createRemoteSubscribable} from '@remote-ui/async-subscription';

type SubscribeCallback<T> = (value: T) => void;

interface Options {
  storageKey: string;
}

export async function createPersistedRemoteSubscribable<T>(
  initialState: T,
  {storageKey}: Options,
) {
  let current: T = await browser.storage.local
    .get([storageKey])
    .then(({[storageKey]: value}) => value ?? initialState);

  const subscribers = new Set<SubscribeCallback<T>>();

  const subscribable = createRemoteSubscribable({
    subscribe: (callback) => {
      subscribers.add(callback);

      return () => {
        subscribers.delete(callback);
      };
    },
    get current() {
      return current;
    },
  });

  function update(value: SetStateActionWithProxy<T>) {
    async function asyncUpdate(value: SetStateActionWithProxy<T>) {
      let computedValue: T;

      if (isProxy<T>(value)) {
        computedValue = await value(current);
      } else {
        computedValue = value;
      }

      // eslint-disable-next-line require-atomic-updates
      current = computedValue;

      subscribers.forEach((callback) => {
        console.log('notifying subs', subscribers.size);
        callback(computedValue);
      });
      browser.storage.local.set({[storageKey]: computedValue});
    }

    asyncUpdate(value);
  }

  function clear() {
    subscribers.clear();
  }

  return {subscribable, update, clear};
}

function isProxy<T>(value: any): value is SetStateProxy<T> {
  return typeof value === 'function' && value?.name === 'proxy';
}

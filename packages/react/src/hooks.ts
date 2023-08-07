import {
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type {StatefulRemoteSubscribable} from '@remote-ui/async-subscription';

import {ExtensionApiContext} from './context';
import {ExtensionApi} from './types';

type Subscriber<T> = Parameters<StatefulRemoteSubscribable<T>['subscribe']>[0];

export function useExtensionApi() {
  const api = useContext(ExtensionApiContext);

  if (!api) {
    throw new Error('No extension api context found');
  }

  return api;
}

export function useLocalStorageState<T>(
  defaultValue: T,
  options: {key: string; scope?: 'host' | 'global'},
): [
  {data: T; loading: boolean},
  (value: SetStateAction<T>, options?: {persist?: boolean}) => void,
] {
  const api = useExtensionApi();

  return useLocalStorageStateInternal(defaultValue, {
    ...options,
    set: api.storage.local.set,
    get: api.storage.local.get,
  });
}

export function useLocalStorageStateInternal<T>(
  defaultValue: T,
  options: {
    key: string;
    scope?: 'host' | 'global';
    get: ExtensionApi['storage']['local']['get'];
    set: ExtensionApi['storage']['local']['set'];
  },
): [
  {data: T; loading: boolean},
  (value: SetStateAction<T>, options?: {persist?: boolean}) => void,
] {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T>(defaultValue);
  const {get, set} = options;

  useEffect(() => {
    async function queryStorage() {
      const result = await get([options.key]);

      let value;
      if (options.scope === 'global') {
        value = result[options.key];
      } else if (!options.scope || options.scope === 'host') {
        value = result[options.key]?.[window.location.host];
      }

      setData(value ?? defaultValue);
      setLoading(false);
    }
    queryStorage();
  }, [get, defaultValue, options.key, options.scope]);

  const setState = useCallback(
    (value: SetStateAction<T>, setterOptions?: {persist?: boolean}) => {
      setData((prev) => {
        let derivedValue: T;
        const persist = setterOptions?.persist ?? true;

        if (typeof value === 'function') {
          derivedValue = (value as Function)(prev);
        } else {
          derivedValue = value;
        }

        if (persist) {
          if (options.scope === 'global') {
            set({[options.key]: derivedValue});
          } else if (!options.scope || options.scope === 'host') {
            // eslint-disable-next-line promise/catch-or-return
            get([options.key]).then((prev) => {
              const next = {
                ...prev[options.key],
                [window.location.host]: derivedValue,
              };

              set({[options.key]: next});
            });
          }
        }

        return derivedValue;
      });
    },
    [get, options.key, options.scope, set],
  );

  return useMemo(
    () => [
      {
        data,
        loading,
      },
      setState,
    ],
    [data, loading, setState],
  );
}

export function useNetworkRequests() {
  const api = useExtensionApi();

  return useSubscription(api.network.requests);
}

export function useSubscription<T>(
  subscription: StatefulRemoteSubscribable<T>,
): T {
  const [, setValue] = useState(subscription.current);

  useEffect(() => {
    let didUnsubscribe = false;

    const checkForUpdates: Subscriber<T> = (newValue) => {
      if (didUnsubscribe) {
        return;
      }

      setValue(newValue);
    };

    const unsubscribe = subscription.subscribe(checkForUpdates);

    // Because we're subscribing in a passive effect,
    // it's possible for an update to occur between render and the effect handler.
    // Check for this and schedule an update if work has occurred.
    checkForUpdates(subscription.current);

    return () => {
      didUnsubscribe = true;
      unsubscribe();
    };
  }, [subscription]);

  return subscription.current;
}

import {
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {ExtensionApiContext} from './context';
import {ExtensionApi} from './types';

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

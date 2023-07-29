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
  options: {key: string},
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

      setData(result[options.key] ?? defaultValue);
      setLoading(false);
    }
    queryStorage();
  }, [get, defaultValue, options.key]);

  const setState = useCallback(
    (value: SetStateAction<T>, setterOptions?: {persist?: boolean}) => {
      setData((prev) => {
        let derivedValue: T;
        const persist = setterOptions?.persist ?? true;

        if (typeof value === 'function') {
          derivedValue = (value as Function)(prev);
          if (persist) {
            set({[options.key]: derivedValue});
          }
          return derivedValue;
        }

        if (persist) {
          set({[options.key]: value});
        }

        return value;
      });
    },
    [options.key, set],
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

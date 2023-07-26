import {
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {ExtensionApiContext} from './context';

export function useExtensionApi() {
  const api = useContext(ExtensionApiContext);

  if (!api) {
    throw new Error('No extension api context found');
  }

  return api;
}

export function usePersistedState<T>(
  defaultValue: T,
  options: {key: string},
): [
  {data?: T; loading: boolean},
  (value: SetStateAction<T | undefined>) => void,
] {
  const api = useExtensionApi();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T | undefined>(undefined);

  useEffect(() => {
    async function queryStorage() {
      const result = await api.storage.local.get([options.key]);

      setData(result[options.key] ?? defaultValue);
      setLoading(false);
    }
    queryStorage();
  }, [api.storage.local, defaultValue, options.key]);

  const setState = useCallback(
    (value: SetStateAction<T | undefined>) => {
      setData((prev) => {
        let derivedValue: T | undefined;

        if (typeof value === 'function') {
          derivedValue = (value as Function)(prev);
          api.storage.local.set({[options.key]: derivedValue});
          return derivedValue;
        }

        api.storage.local.set({[options.key]: value});

        return value;
      });
    },
    [api.storage.local, options.key],
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

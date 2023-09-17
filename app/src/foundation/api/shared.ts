/* eslint-disable @shopify/react-hooks-strict-return */

import {Dispatch, useCallback, useEffect, useRef, useState} from 'react';
import {RemoteSubscribable} from '@remote-ui/async-subscription';
import {SetStateActionWithProxy, SetStateProxy} from '@aside/core';

import {useRemoteSubscribable} from '../../utilities/subscription';

export type CleanupFunction = () => void;

export function useRemoteSubscribableWithStorage<T>(
  initialState: T,
  options: {storageKey: string},
): [
  RemoteSubscribable<T>,
  Dispatch<SetStateActionWithProxy<T>>,
  CleanupFunction,
  Promise<T>,
] {
  const [state, setInternalState] = useState(initialState);
  const {subscribable, clear} = useRemoteSubscribable<T>(state);

  const stateRef = useRef(state);
  stateRef.current = state;

  const resolveRef = useRef<((value: T) => void) | undefined>();
  const promiseRef = useRef<Promise<T>>(
    new Promise((resolve) => {
      resolveRef.current = resolve;
    }),
  );

  const setState = useCallback(
    (valueOrGetter: SetStateActionWithProxy<T>) => {
      async function setStateAsync(valueOrGetter: SetStateActionWithProxy<T>) {
        if (isProxy<T>(valueOrGetter)) {
          const valueFromProxy = await valueOrGetter(stateRef.current);

          setInternalState(valueFromProxy);
          browser.storage.local.set({[options.storageKey]: valueFromProxy});
        } else {
          setInternalState(valueOrGetter as any);
          browser.storage.local.set({[options.storageKey]: valueOrGetter});
        }
      }

      setStateAsync(valueOrGetter);
    },
    [options.storageKey],
  );

  useEffect(() => {
    browser.storage.local
      .get([options.storageKey])
      .then(({[options.storageKey]: value}) => {
        if (value != null) {
          setInternalState(value);
        }
        return resolveRef.current?.(value);
      })
      .catch(() => {
        return resolveRef.current?.(initialState);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.storageKey]);

  return [subscribable, setState, clear, promiseRef.current];
}

function isProxy<T>(value: any): value is SetStateProxy<T> {
  return typeof value === 'function' && value?.name === 'proxy';
}

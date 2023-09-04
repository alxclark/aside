import {useCallback, useEffect, useMemo, useRef} from 'react';
import {
  RemoteSubscribable,
  createRemoteSubscribable,
} from '@remote-ui/async-subscription';

type SubscribeCallback<T> = (value: T) => void;
type UnsubscribeCallback = () => void;

type SubscribeFunction<T> = (
  callback: SubscribeCallback<T>,
) => UnsubscribeCallback;

type Getter<T> = () => T;

export interface Subscription<T> {
  subscribe: SubscribeFunction<T>;
  current: T;
}

export function useRemoteSubscribable<T>(value: T): {
  subscribable: RemoteSubscribable<T>;
  clear: () => void;
} {
  const valueRef = useRef(value);
  valueRef.current = value;

  const subscriberRef = useRef<Set<SubscribeCallback<T>>>();

  if (!subscriberRef.current) {
    subscriberRef.current = new Set<SubscribeCallback<T>>();
  }

  const subscribe = useCallback<SubscribeFunction<T>>(
    (callback: SubscribeCallback<T>) => {
      const subscribers = subscriberRef.current!;
      subscribers.add(callback);

      return () => {
        subscribers.delete(callback);
      };
    },
    [],
  );

  const getCurrent = useCallback<Getter<T>>(() => valueRef.current, []);

  useEffect(() => {
    const subscribers = subscriberRef.current!;
    subscribers.forEach((callback) => callback(valueRef.current));
  }, [value]);

  return useMemo(() => {
    return {
      subscribable: createRemoteSubscribable({
        subscribe,
        get current() {
          return getCurrent();
        },
      }),
      clear: () => {
        subscriberRef.current?.clear();
      },
    };
  }, [getCurrent, subscribe]);
}

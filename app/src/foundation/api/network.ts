import {
  ApiCreator,
  NetworkRequest,
  StatelessExtensionApiOnHost,
} from '@aside/core';
import {useCallback, useEffect, useMemo} from 'react';
import {signal, effect} from '@preact/signals-core';
import {createRemoteSubscribable} from '@remote-ui/async-subscription';

export function useNetworkApi(): ApiCreator<
  StatelessExtensionApiOnHost['network']
> {
  const networkRequests = useMemo(() => {
    return signal<NetworkRequest[]>([]);
  }, []);

  const {subscribable: requests, clear: clearSubscription} = useMemo(() => {
    return {
      subscribable: createRemoteSubscribable({
        subscribe: (callback) => {
          const dispose = effect(() => {
            callback(networkRequests.value);
          });

          return () => dispose();
        },
        get current() {
          return networkRequests.value;
        },
      }),
      clear: () => {
        networkRequests.value = [];
      },
    };
  }, [networkRequests]);

  const requestSubscribers = useMemo(
    () => new Set<(request: NetworkRequest) => void>(),
    [],
  );

  // Read HAR to retrieve requests that happened before the devtools was ready.
  useEffect(() => {
    // getHAR is not typed correctly
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    /** @ts-ignore */
    browser.devtools.network.getHAR((har) => {
      networkRequests.value = har.entries;
    });
  }, [networkRequests]);

  useEffect(() => {
    const listener = async (rawRequest: any) => {
      const request: any = {};

      // Loop through the properties of the Proxy and copy them to the new object
      // eslint-disable-next-line guard-for-in
      for (const property in rawRequest) {
        request[property] = rawRequest[property];
      }

      networkRequests.value = [...networkRequests.value, request];

      requestSubscribers.forEach((callback) => callback(request));
    };

    browser.devtools.network.onRequestFinished.addListener(listener);

    return () =>
      browser.devtools.network.onRequestFinished.removeListener(listener);
  }, [networkRequests, requestSubscribers]);

  const onRequestFinished = useCallback(
    async (callback: any) => {
      requestSubscribers.add(callback);

      return () => {
        requestSubscribers.delete(callback);
      };
    },
    [requestSubscribers],
  );

  const reset = useCallback(() => {
    clearSubscription();
    requestSubscribers.clear();
  }, [clearSubscription, requestSubscribers]);

  const api: ApiCreator<StatelessExtensionApiOnHost['network']>['api'] =
    useMemo(
      () => async () =>
        [
          {
            clear: clearSubscription,
            onRequestFinished,
            requests,
          },
          reset,
        ],
      [clearSubscription, onRequestFinished, requests, reset],
    );

  return useMemo(() => ({api, reset}), [api, reset]);
}

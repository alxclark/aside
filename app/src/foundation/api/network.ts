import {ExtensionApi, NetworkRequest} from '@aside/core';
import {useCallback, useEffect, useMemo, useState} from 'react';

import {useRemoteSubscribable} from '../../utilities/subscription';

export function useNetworkApi(): {
  api: ExtensionApi['network'];
  reset: () => void;
} {
  const [networkRequests, setNetworkRequests] = useState<NetworkRequest[]>([]);
  const {subscribable: requests, clear: clearSubscription} =
    useRemoteSubscribable(networkRequests);

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
      setNetworkRequests(har.entries);
    });
  }, []);

  useEffect(() => {
    const listener = async (rawRequest: any) => {
      const request: any = {};

      // Loop through the properties of the Proxy and copy them to the new object
      // eslint-disable-next-line guard-for-in
      for (const property in rawRequest) {
        request[property] = rawRequest[property];
      }

      setNetworkRequests((prev) => [...prev, request]);

      requestSubscribers.forEach((callback) => callback(request));
    };

    browser.devtools.network.onRequestFinished.addListener(listener);

    return () =>
      browser.devtools.network.onRequestFinished.removeListener(listener);
  }, [requestSubscribers]);

  const onRequestFinished = useCallback(
    (callback: any) => {
      requestSubscribers.add(callback);

      return () => {
        requestSubscribers.delete(callback);
      };
    },
    [requestSubscribers],
  );

  const clear = useCallback(() => {
    setNetworkRequests([]);
  }, []);

  const api: ExtensionApi['network'] = useMemo(
    () => ({
      clear,
      onRequestFinished,
      requests,
    }),
    [clear, onRequestFinished, requests],
  );

  const reset = useCallback(() => {
    clearSubscription();
    requestSubscribers.clear();
    setNetworkRequests([]);
  }, [clearSubscription, requestSubscribers]);

  return useMemo(() => ({api, reset}), [api, reset]);
}

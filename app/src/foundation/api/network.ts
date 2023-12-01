import {
  ApiCreator,
  NetworkRequest,
  StatelessExtensionApiOnHost,
} from '@aside/core';
import {useMemo} from 'react';
import {signal, effect} from '@preact/signals-core';
import {createRemoteSubscribable} from '@remote-ui/async-subscription';

export function useNetworkApi(): ApiCreator<
  StatelessExtensionApiOnHost['network']
> {
  const api: ApiCreator<StatelessExtensionApiOnHost['network']>['api'] =
    useMemo(
      () =>
        async ({capabilities}) => {
          const networkCapability = capabilities?.includes('network');
          const networkRequests = signal<NetworkRequest[]>([]);
          const listeners = new Set<(request: NetworkRequest) => void>();

          const listener = async (rawRequest: any) => {
            const request: any = {};

            // Loop through the properties of the Proxy and copy them to the new object
            // eslint-disable-next-line guard-for-in
            for (const property in rawRequest) {
              request[property] = rawRequest[property];
            }

            networkRequests.value = [...networkRequests.value, request];

            listeners.forEach((callback) => callback(request));
          };

          if (networkCapability) {
            // Load initial requests from HAR
            await new Promise<void>((resolve) => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              /** @ts-ignore */
              browser.devtools.network.getHAR((har) => {
                networkRequests.value = har.entries;

                resolve();
              });
            });

            // For subsequent requests, setup a listener
            browser.devtools.network.onRequestFinished.addListener(listener);
          }

          const onRequestFinished = async (callback: any) => {
            if (!networkCapability) return () => {};

            listeners.add(callback);

            return () => {
              listeners.delete(callback);
            };
          };

          const reset = () => {
            listeners.clear();
            browser.devtools.network.onRequestFinished.removeListener(listener);
          };

          return [
            {
              clear: () => {
                networkRequests.value = [];
              },
              onRequestFinished,
              requests: createRemoteSubscribable({
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
            },
            reset,
          ];
        },
      [],
    );

  return useMemo(() => ({api}), [api]);
}

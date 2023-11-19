import React, {
  PropsWithChildren,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import {
  fromWebpage,
  WebpageApi,
  ContentScriptApiForWebpage,
  StatefullExtensionApi,
} from '@aside/core';
import {RemoteRoot, createRemoteRoot} from '@remote-ui/react';
import {createEndpoint, Endpoint, release, retain} from '@remote-ui/rpc';
import {makeStatefulSubscribable} from '@remote-ui/async-subscription';
import type {RemoteChannel} from '@remote-ui/core';

import {AllComponents} from '../ui';
import {ExtensionApiContext} from '../context';

import {RemoteRenderer} from './RemoteRenderer';
import {ErrorBoundary} from './ErrorBoundary';

const contentScript = createContentScriptEndpoint();

export function Devtools({children}: PropsWithChildren<{}>) {
  const [devToolsRoot, setDevtoolsRoot] = useState<RemoteRoot | undefined>();
  const channelRef = useRef<RemoteChannel | null>(null);
  const endpointRef = useRef<Endpoint<ContentScriptApiForWebpage> | null>(null);

  const mountDevtools = useCallback(
    async (endpoint: Endpoint<ContentScriptApiForWebpage>) => {
      const channel = await endpoint.call.getRemoteChannel();

      retain(channel);

      channelRef.current = channel;
      endpointRef.current = endpoint;

      const root = createRemoteRoot(channel, {
        components: AllComponents,
      });

      setDevtoolsRoot(root);
    },
    [],
  );

  useEffect(() => {
    contentScript.call.showWebpageUsesAside();
  }, []);

  useEffect(() => {
    const webpageApi: WebpageApi = {
      async mountDevtools() {
        return mountDevtools(contentScript);
      },
      unmountDevtools() {
        setDevtoolsRoot(undefined);
      },
      log(source, ...params: any[]) {
        const sourcePrefix = `[${source}]`;

        console.log(sourcePrefix, ...params);
      },
    };

    contentScript.expose(webpageApi);
    contentScript.call.ready();
  }, [mountDevtools]);

  const handleUnmount = useCallback(() => {
    release(channelRef.current);
    channelRef.current = null;
  }, []);

  if (devToolsRoot && endpointRef.current) {
    return (
      <RemoteRenderer root={devToolsRoot} onUnmount={handleUnmount}>
        <ErrorBoundary>
          <ExtensionApiProvider endpoint={endpointRef.current}>
            {children}
          </ExtensionApiProvider>
        </ErrorBoundary>
      </RemoteRenderer>
    );
  }

  return null;
}

function ExtensionApiProvider({
  endpoint,
  children,
}: PropsWithChildren<{
  endpoint: Endpoint<ContentScriptApiForWebpage>;
}>) {
  const [statefulApi, setStatefulApi] = useState<StatefullExtensionApi>();

  useEffect(() => {
    async function getApi() {
      const api = await endpoint.call.getApi();
      retain(api);

      // Make stateful all stateless subscribable received by the devtools
      setStatefulApi({
        network: {
          requests: makeStatefulSubscribable(api.network.requests),
          onRequestFinished: api.network.onRequestFinished,
          clear: api.network.clear,
        },
        activity: {
          filter: [
            makeStatefulSubscribable(api.activity.filter[0]),
            api.activity.filter[1],
          ],
          invertFilter: [
            makeStatefulSubscribable(api.activity.invertFilter[0]),
            api.activity.invertFilter[1],
          ],
          preserveLog: [
            makeStatefulSubscribable(api.activity.preserveLog[0]),
            api.activity.preserveLog[1],
          ],
          recordSnapshot: [
            makeStatefulSubscribable(api.activity.recordSnapshot[0]),
            api.activity.recordSnapshot[1],
          ],
          showFilter: [
            makeStatefulSubscribable(api.activity.showFilter[0]),
            api.activity.showFilter[1],
          ],
          showPreviousValues: [
            makeStatefulSubscribable(api.activity.showPreviousValues[0]),
            api.activity.showPreviousValues[1],
          ],
          showTimelineOptions: [
            makeStatefulSubscribable(api.activity.showTimelineOptions[0]),
            api.activity.showTimelineOptions[1],
          ],
        },
        storage: {
          local: {
            get: api.storage.local.get,
            set: api.storage.local.set,
          },
        },
      });

      return () => release(api);
    }

    const apiPromise = getApi();

    return () => {
      apiPromise.then((release) => release()).catch(() => {});
    };
  }, [endpoint.call]);

  if (!statefulApi) return null;

  return (
    <ExtensionApiContext.Provider value={statefulApi}>
      {children}
    </ExtensionApiContext.Provider>
  );
}

function createContentScriptEndpoint() {
  return createEndpoint<ContentScriptApiForWebpage>(
    fromWebpage({context: 'webpage'}),
    {
      callable: [
        'getRemoteChannel',
        'getLocalStorage',
        'setLocalStorage',
        'getApi',
        'showWebpageUsesAside',
        'ready',
      ],
    },
  );
}

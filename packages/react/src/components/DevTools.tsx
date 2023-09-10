import React, {
  PropsWithChildren,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import {
  fromWebpage,
  WebpageApi,
  ContentScriptApiForWebpage,
  StatefulExtensionApi as SubscribableApi,
} from '@aside/core';
import {RemoteRoot, createRemoteRoot} from '@remote-ui/react';
import {createEndpoint, Endpoint, release, retain} from '@remote-ui/rpc';
import {makeStatefulSubscribable} from '@remote-ui/async-subscription';
import type {RemoteChannel} from '@remote-ui/core';

import {AllComponents} from '../ui';
import {ExtensionApiContext} from '../context';
import {ExtensionApi} from '../types';
import {useLocalStorageStateInternal} from '../hooks';

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
      async resetChannel() {
        console.log('reset channel');
      },
    };

    contentScript.expose(webpageApi);
  }, [setDevtoolsRoot, mountDevtools]);

  // Attempt to mount the dev tools.
  // If the other side of the endpoint is not ready yet,
  // `mountDevtools` will be called on the webpage api,
  // correctly setting up the remote endpoint.
  useEffect(() => {
    mountDevtools(contentScript);
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
  const [subscribableApi, setSubscribableApi] = useState<SubscribableApi>();

  const get: ExtensionApi['storage']['local']['get'] = useCallback(
    (keys) => endpoint.call.getLocalStorage(keys),
    [endpoint],
  );
  const set: ExtensionApi['storage']['local']['set'] = useCallback(
    (items) => endpoint.call.setLocalStorage(items),
    [endpoint],
  );

  const recordSnapshot = useLocalStorageStateInternal(true, {
    key: 'record-snapshot',
    get,
    set,
    scope: 'global',
  });

  const filter = useLocalStorageStateInternal('', {
    key: 'filter',
    get,
    set,
    scope: 'global',
  });

  const showFilter = useLocalStorageStateInternal(true, {
    key: 'show-filter',
    get,
    set,
    scope: 'global',
  });

  const preserveLog = useLocalStorageStateInternal(false, {
    key: 'preserve-log',
    get,
    set,
    scope: 'global',
  });

  const invertFilter = useLocalStorageStateInternal(false, {
    key: 'invert-filter',
    get,
    set,
    scope: 'global',
  });

  const showPreviousValues = useLocalStorageStateInternal(false, {
    key: 'show-previous-values',
    get,
    set,
    scope: 'global',
  });

  const showTimelineOptions = useLocalStorageStateInternal(false, {
    key: 'show-timeline-options',
    get,
    set,
    scope: 'global',
  });

  useEffect(() => {
    async function getApi() {
      const api = await endpoint.call.getApi();

      // Make stateful all stateless subscribable received by the devtools
      setSubscribableApi({
        network: {
          requests: makeStatefulSubscribable(api.network.requests),
          onRequestFinished: api.network.onRequestFinished,
          clear: api.network.clear,
        },
      });
    }

    getApi();
  }, [endpoint.call]);

  const api: ExtensionApi | undefined = useMemo(() => {
    return {
      network: {
        requests: subscribableApi?.network.requests!,
        onRequestFinished: subscribableApi?.network.onRequestFinished!,
        clear: subscribableApi?.network.clear!,
      },
      storage: {
        local: {
          get,
          set,
        },
      },
      timeline: {
        recordSnapshot,
        filter,
        showFilter,
        preserveLog,
        invertFilter,
        showPreviousValues,
        showTimelineOptions,
      },
      activity: {
        recordSnapshot,
        filter,
        showFilter,
        preserveLog,
        invertFilter,
        showPreviousValues,
        showTimelineOptions,
      },
    };
  }, [
    filter,
    get,
    invertFilter,
    preserveLog,
    recordSnapshot,
    set,
    showFilter,
    showPreviousValues,
    showTimelineOptions,
    subscribableApi?.network.clear,
    subscribableApi?.network.onRequestFinished,
    subscribableApi?.network.requests,
  ]);

  if (!subscribableApi) return null;

  return (
    <ExtensionApiContext.Provider value={api}>
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
      ],
    },
  );
}

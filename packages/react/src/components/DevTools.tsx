import React, {
  PropsWithChildren,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import {fromWebpage, WebpageApi} from '@aside/web';
import {RemoteRoot, createRemoteRoot} from '@remote-ui/react';
import {createEndpoint, Endpoint, release, retain} from '@remote-ui/rpc';
import {ContentScriptApiForWebpage} from '@aside/extension';
import type {RemoteChannel} from '@remote-ui/core';

import {AllComponents} from '../ui';
import {ExtensionApiContext} from '../context';
import {ExtensionApi} from '../types';

import {RemoteRenderer} from './RemoteRenderer';

const contentScript = createContentScriptEndpoint();

export function DevTools({children}: PropsWithChildren<{}>) {
  const [devToolsRoot, setDevToolsRoot] = useState<RemoteRoot | undefined>();
  const channelRef = useRef<RemoteChannel | null>(null);
  const endpointRef = useRef<Endpoint<ContentScriptApiForWebpage> | null>(null);

  const mountDevTools = useCallback(
    async (endpoint: Endpoint<ContentScriptApiForWebpage>) => {
      const channel = await endpoint.call.getDevToolsChannel();
      retain(channel);

      channelRef.current = channel;
      endpointRef.current = endpoint;

      const root = createRemoteRoot(channel, {
        components: AllComponents,
      });

      setDevToolsRoot(root);
    },
    [],
  );

  useEffect(() => {
    const webpageApi: WebpageApi = {
      async mountDevTools() {
        return mountDevTools(contentScript);
      },
      unmountDevTools() {
        setDevToolsRoot(undefined);
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
  }, [setDevToolsRoot, mountDevTools]);

  const handleUnmount = useCallback(() => {
    release(channelRef.current);
    channelRef.current = null;
  }, []);

  const api: ExtensionApi | undefined = useMemo(() => {
    if (!endpointRef.current) {
      return;
    }

    return {
      storage: {
        local: {
          get: endpointRef.current.call.getLocalStorage,
          set: endpointRef.current.call.setLocalStorage,
        },
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devToolsRoot]);

  if (devToolsRoot) {
    return (
      <RemoteRenderer root={devToolsRoot} onUnmount={handleUnmount}>
        <ExtensionApiContext.Provider value={api}>
          {children}
        </ExtensionApiContext.Provider>
      </RemoteRenderer>
    );
  }

  return null;
}

function createContentScriptEndpoint() {
  return createEndpoint<ContentScriptApiForWebpage>(
    fromWebpage({context: 'webpage'}),
    {
      callable: ['getDevToolsChannel', 'getLocalStorage', 'setLocalStorage'],
    },
  );
}

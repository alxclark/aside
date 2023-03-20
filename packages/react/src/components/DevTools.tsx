import React, {
  PropsWithChildren,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import {fromWebpage, WebpageApi} from '@aside/web';
import {RemoteRoot, createRemoteRoot} from '@remote-ui/react';
import {createEndpoint, Endpoint, release, retain} from '@remote-ui/rpc';
import {ContentScriptApiForWebpage} from '@aside/extension';
import type {RemoteChannel} from '@remote-ui/core';

import {AllComponents} from '../ui';

import {RemoteRenderer} from './RemoteRenderer';

const initialEndpoint = createContentScriptEndpoint();

export function DevTools({children}: PropsWithChildren<{}>) {
  const [devToolsRoot, setDevToolsRoot] = useState<RemoteRoot | undefined>();
  const channelRef = useRef<RemoteChannel | null>(null);
  const restartingRef = useRef(false);

  console.log({devToolsRoot});

  const [contentScript, setContentScript] =
    useState<Endpoint<ContentScriptApiForWebpage>>(initialEndpoint);

  console.log(contentScript);

  const mountDevTools = useCallback(
    async (endpoint: Endpoint<ContentScriptApiForWebpage>) => {
      console.log('mounting dev tools');

      const channel = await endpoint.call.getDevToolsChannel();
      retain(channel);

      channelRef.current = channel;

      const root = createRemoteRoot(channel, {
        components: AllComponents,
      });

      setDevToolsRoot(root);
    },
    [],
  );

  useEffect(() => {
    console.log('checking restart', restartingRef.current);
    if (!restartingRef.current) return;

    mountDevTools(contentScript);
  }, [contentScript, mountDevTools]);

  const resetChannel = useCallback(() => {
    console.log('resetting channel');

    setContentScript((prev) => {
      console.log(prev);
      console.log('terminating previous endpoint');
      prev.terminate();

      release(channelRef.current);
      console.log('setting channel = null');
      channelRef.current = null;

      console.log('overriding content script');

      console.log('creating new endpoint');
      const endpoint = createContentScriptEndpoint();

      // somehow this causes weird shit, theres a second endpoint created in between
      // and both endpoint answers messages going forward

      return endpoint;
    });

    restartingRef.current = true;
  }, []);

  useEffect(() => {
    const webpageApi: WebpageApi = {
      async mountDevTools() {
        console.log('mountDevtools');
        mountDevTools(contentScript);
      },
      unmountDevTools() {
        console.log('unmount');
        setDevToolsRoot(undefined);
      },
      log(source, ...params: any[]) {
        const sourcePrefix = `[${source}]`;

        console.log(sourcePrefix, ...params);
      },
      async resetChannel() {
        console.log('reset channel');
        resetChannel();
      },
    };

    console.log('exposing');

    contentScript.expose(webpageApi);
  }, [setDevToolsRoot, contentScript, mountDevTools, resetChannel]);

  if (devToolsRoot) {
    return <RemoteRenderer root={devToolsRoot}>{children}</RemoteRenderer>;
  }

  return null;
}

function createContentScriptEndpoint() {
  return createEndpoint<ContentScriptApiForWebpage>(
    fromWebpage({context: 'webpage'}),
    {
      callable: ['getDevToolsChannel'],
    },
  );
}

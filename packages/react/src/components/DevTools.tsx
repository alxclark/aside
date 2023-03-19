import React, {
  PropsWithChildren,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {fromWebpage, WebpageApi} from '@aside/web';
import {RemoteRoot, createRemoteRoot} from '@remote-ui/react';
import {createEndpoint, Endpoint, retain} from '@remote-ui/rpc';
import {ContentScriptApiForWebpage} from '@aside/extension';

import {AllComponents} from '../ui';

import {RemoteRenderer} from './RemoteRenderer';

const initialEndpoint = createContentScriptEndpoint();

export function DevTools({children}: PropsWithChildren<{}>) {
  const [devToolsRoot, setDevToolsRoot] = useState<RemoteRoot | undefined>();

  const [contentScript, setContentScript] =
    useState<Endpoint<ContentScriptApiForWebpage>>(initialEndpoint);

  const mountDevTools = useCallback(async () => {
    console.log('mounting dev tools');
    const channel = await contentScript.call.getDevToolsChannel();
    retain(channel);

    const root = createRemoteRoot(channel, {
      components: AllComponents,
    });

    setDevToolsRoot(root);
  }, [contentScript.call]);

  const resetChannel = useCallback(() => {
    console.log('resetting channel');
    setContentScript(createContentScriptEndpoint());
  }, []);

  useEffect(() => {
    const webpageApi: WebpageApi = {
      async mountDevTools() {
        mountDevTools();
      },
      unmountDevTools() {
        setDevToolsRoot(undefined);
      },
      log(source, ...params: any[]) {
        const sourcePrefix = `[${source}]`;

        console.log(sourcePrefix, ...params);
      },
      resetChannel() {
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

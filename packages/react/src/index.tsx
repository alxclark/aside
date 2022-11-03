import React, {PropsWithChildren, useEffect, useState} from 'react';
import {WebpageApi, fromWebpage} from '@companion/web';
import type {ContentScriptApiForWebpage} from '@companion/extension';
import {createEndpoint, retain} from '@remote-ui/rpc';
import {createRemoteRoot, RemoteRoot} from '@remote-ui/core';
import {render} from '@remote-ui/react';

import {AllComponents} from './components';

window.__companion = {log: () => {}};

const contentScript = createEndpoint<ContentScriptApiForWebpage>(
  fromWebpage({context: 'webpage'}),
  {
    callable: ['getDevToolsChannel'],
  },
);

export function Companion({children}: PropsWithChildren<{}>) {
  return <>{children}</>;
}

export function DevTools({children}: PropsWithChildren<{}>) {
  const [devToolsRoot, setDevToolsRoot] = useState<RemoteRoot | undefined>();

  useEffect(() => {
    const webpageApi: WebpageApi = {
      async mountDevTools() {
        if (devToolsRoot) return;

        const channel = await contentScript.call.getDevToolsChannel();
        retain(channel);

        const root = createRemoteRoot(channel, {
          components: AllComponents,
        });

        setDevToolsRoot(root);
      },
      unmountDevTools() {
        setDevToolsRoot(undefined);
      },
      log(source, ...params: any[]) {
        const sourcePrefix = `[${source}]`;

        console.log(sourcePrefix, ...params);
      },
    };

    contentScript.expose(webpageApi);
  }, [setDevToolsRoot, devToolsRoot]);

  if (devToolsRoot) {
    return <RemoteRenderer root={devToolsRoot}>{children}</RemoteRenderer>;
  }

  return null;
}

export function RemoteRenderer({
  children,
  root,
}: PropsWithChildren<{root: RemoteRoot}>) {
  useEffect(() => {
    render(<>{children}</>, root, root.mount);
  }, [children, root]);

  return null;
}

export * from './components';

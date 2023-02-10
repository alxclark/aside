import React, {PropsWithChildren, useEffect, useMemo, useState} from 'react';
import {WebpageApi, fromWebpage} from '@aside/web';
import type {ContentScriptApiForWebpage} from '@aside/extension';
import {createEndpoint, retain} from '@remote-ui/rpc';
import {createRemoteRoot, RemoteRoot} from '@remote-ui/core';
import {createReconciler, render} from '@remote-ui/react';

import {AllComponents} from './components';

window.__aside = {log: () => {}};

const contentScript = createEndpoint<ContentScriptApiForWebpage>(
  fromWebpage({context: 'webpage'}),
  {
    callable: ['getDevToolsChannel'],
  },
);

export function Aside({children}: PropsWithChildren<{}>) {
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
  const reconciler = useMemo(() => createReconciler({primary: false}), []);

  useEffect(() => {
    render(<>{children}</>, root, root.mount, reconciler);
  }, [children, root, reconciler]);

  return null;
}

export * from './components';

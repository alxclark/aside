import React, {PropsWithChildren, useState, useEffect} from 'react';
import {fromWebpage, WebpageApi} from '@aside/web';
import {RemoteRoot, createRemoteRoot} from '@remote-ui/react';
import {createEndpoint, retain} from '@remote-ui/rpc';
import {ContentScriptApiForWebpage} from '@aside/extension';

import {AllComponents} from '../ui';

import {RemoteRenderer} from './RemoteRenderer';

const contentScript = createEndpoint<ContentScriptApiForWebpage>(
  fromWebpage({context: 'webpage'}),
  {
    callable: ['getDevToolsChannel'],
  },
);

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

import React, { PropsWithChildren, useEffect, useState } from "react";
import { WebpageApi, fromWebpage } from "@companion/web";
import { ContentScriptApiForWebpage } from "@companion/content-script";
import {createEndpoint, retain} from '@remote-ui/rpc'
import { createRemoteRoot, RemoteRoot } from "@remote-ui/core";
import { Button } from "./components";
import { render } from "@remote-ui/react";

const contentScript = createEndpoint<ContentScriptApiForWebpage>(fromWebpage({context: 'webpage'}), {
  callable: ['getDevToolsChannel']
})

export function Companion({children} : PropsWithChildren<{}>) {
  return <>{children}</>;
}

export function DevTools({children} : PropsWithChildren<{}>) {
  const [devToolsRoot, setDevToolsRoot] = useState<RemoteRoot | undefined>();

  useEffect(() => {
    const webpageApi: WebpageApi = {
      async mountDevTools() {
        if(devToolsRoot) return

        const channel = await contentScript.call.getDevToolsChannel()
        retain(channel);

        console.log({channel})

        const root = createRemoteRoot(channel, {
          components: [Button],
        });

        setDevToolsRoot(root);
      },
      unmountDevTools() {
        setDevToolsRoot(undefined);
      },
    }

    contentScript.expose(webpageApi)
  }, [setDevToolsRoot, devToolsRoot])

  if (devToolsRoot) {
    return <RemoteRenderer root={devToolsRoot}>{children}</RemoteRenderer>
  }

  return null;
}

export function RemoteRenderer({children, root}: PropsWithChildren<{root: RemoteRoot}>) {
  useEffect(() => {
    console.log('Rendering with remote renderer', root)
    render(
      <>{children}</>,
      root,
      root.mount
    );
  }, [children]);

  return null;
}

export * from './components'
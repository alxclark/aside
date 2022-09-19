import React, { useEffect, useState } from "react";
import { WebpageApi, ContentScriptApi, fromWebpage } from "@companion/web";
import {createEndpoint} from '@remote-ui/rpc'

const contentScript = createEndpoint<WebpageApi>(fromWebpage({context: 'webpage'}), {
  callable: ['init']
})

export function Companion() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const contentScriptApi: ContentScriptApi = {
      mount: () => {
        setMounted(true);
      },
      unmount: () => {
        setMounted(false);
      },
    }

    contentScript.expose(contentScriptApi)

    contentScript.call.init();
  }, [contentScript, setMounted])

  if (mounted) {
    return <RemoteRenderer />
  }

  return null;
}

export function RemoteRenderer() {
  return null;
}
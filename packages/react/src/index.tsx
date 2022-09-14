import React, { useEffect, useMemo, useState } from "react";
import { fromWebpage, WebpageApi, ContentScriptApi } from "@companion/core";
import {createEndpoint} from '@remote-ui/rpc'

export function Companion() {
  const [mounted, setMounted] = useState(false);

  const contentScript = useMemo(() => createEndpoint<WebpageApi>(fromWebpage({context: 'webpage'}), {
    callable: ['init']
  }), [])

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
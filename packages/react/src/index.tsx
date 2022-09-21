import React, { useEffect, useState } from "react";
import { WebpageApi, fromWebpage } from "@companion/web";
import { ContentScriptApiForWebpage } from "@companion/content-script";
import {createEndpoint} from '@remote-ui/rpc'

const contentScript = createEndpoint<ContentScriptApiForWebpage>(fromWebpage({context: 'webpage'}), {
  callable: ['setReceiver']
})

export function Companion() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const webpageApi: WebpageApi = {
      setReceiver(receiver) {
        console.log({receiver})
      }
    }

    contentScript.expose(webpageApi)
  }, [contentScript, setMounted])

  if (mounted) {
    return <RemoteRenderer />
  }

  return null;
}

export function RemoteRenderer() {
  return null;
}
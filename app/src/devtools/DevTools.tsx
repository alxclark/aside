import {
  RemoteRenderer,
  createController,
  createRemoteReceiver,
} from '@remote-ui/react/host'
import { createEndpoint } from '@remote-ui/rpc'
import React, { useEffect, useMemo } from 'react'
import type { BackgroundApiForDevTools } from '@companion/background'
import type { DevToolsApi } from '@companion/dev-tools'
import { fromDevTools } from '@companion/dev-tools'
import { Button } from '../components/Buttons'

const background = createEndpoint<BackgroundApiForDevTools>(fromDevTools(), {
  callable: ['sendReceiverToContentScript', 'placeholderForDevTools'],
})

export function BrowserExtensionRenderer() {
  const controller = useMemo(() => createController({ Button }), [])
  const receiver = useMemo(() => createRemoteReceiver(), [])

  useEffect(() => {
    const devToolsApi: DevToolsApi = {
      placeholderForDevTools() {
        console.log('placeholder for dev tools')
      },
    }

    background.expose(devToolsApi)
    background.call.sendReceiverToContentScript(receiver.receive)
  }, [receiver])

  return <RemoteRenderer receiver={receiver} controller={controller} />
}

export function DevTools() {
  return <BrowserExtensionRenderer />
}

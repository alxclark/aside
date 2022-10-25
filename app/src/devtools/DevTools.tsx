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
import { Button } from '../components/Button'

const background = createEndpoint<BackgroundApiForDevTools>(fromDevTools(), {
  callable: ['getDevToolsChannel'],
})

export function BrowserExtensionRenderer() {
  const controller = useMemo(() => createController({ Button }), [])
  const receiver = useMemo(() => createRemoteReceiver(), [])

  useEffect(() => {
    const devToolsApi: DevToolsApi = {
      getDevToolsChannel() {
        return receiver.receive
      },
    }

    background.expose(devToolsApi)
  }, [receiver])

  return <RemoteRenderer receiver={receiver} controller={controller} />
}

export function DevTools() {
  return <BrowserExtensionRenderer />
}

import {
  RemoteRenderer,
  createController,
  createRemoteReceiver,
} from '@remote-ui/react/host'
import { createEndpoint } from '@remote-ui/rpc'
import React, { useEffect, useMemo } from 'react'
import type { DevToolsApi } from '@companion/dev-tools'
import { fromDevTools } from '@companion/dev-tools'
import { Button } from '../components/Buttons'

const background = createEndpoint<DevToolsApi>(fromDevTools(), {
  callable: ['init'],
})

export function BrowserExtensionRenderer() {
  const controller = useMemo(() => createController({ Button }), [])
  const receiver = useMemo(() => createRemoteReceiver(), [])

  useEffect(() => {
    console.log(Date.now())
    background.call.init()
  }, [receiver])

  return <RemoteRenderer receiver={receiver} controller={controller} />
}

export function DevTools() {
  return <BrowserExtensionRenderer />
}

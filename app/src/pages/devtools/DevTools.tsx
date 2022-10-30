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
import { Button } from '../../components/Button'

function log(...message: any[]) {
  const event = new CustomEvent('companion-log', {
    detail: {
      message,
    },
  })

  window.dispatchEvent(event)
}

window.__companion = { log }

const background = createEndpoint<BackgroundApiForDevTools>(fromDevTools(), {
  callable: ['getDevToolsChannel', 'log'],
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

    const listener = (event: any) => {
      background.call.log('devtools', ...(event as CustomEvent<any>).detail.message)
    }

    window.addEventListener('companion-log', listener)

    background.expose(devToolsApi)

    return () => {
      window.removeEventListener('companion-log', listener)
    }
  }, [receiver])

  return <RemoteRenderer receiver={receiver} controller={controller} />
}

export function DevTools() {
  return <BrowserExtensionRenderer />
}

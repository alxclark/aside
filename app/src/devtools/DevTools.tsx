import {
  RemoteRenderer,
  createController,
  createRemoteReceiver,
} from '@remote-ui/react/host'
import type { MessageEndpoint } from '@remote-ui/rpc'
import { createEndpoint, fromMessagePort } from '@remote-ui/rpc'
import { useEffect, useMemo } from 'react'
import type { Runtime } from 'webextension-polyfill'
import { Button } from '~/components/Buttons'

export function BrowserExtensionRenderer() {
  useEffect(() => {
    browser.runtime.onConnect.addListener((port) => {
      const devToolsListener = (msg: any, port: any) => {
        console.log({ msg, port })
        console.log(port.sender.tab.id)
      }

      port.onMessage.addListener(devToolsListener)
    })
  }, [])

  return <p>Browser extension</p>
  browser.tabs.getCurrent()
  const port = useMemo(() => browser.runtime.connect(), [])
  const controller = useMemo(() => createController({ Button }), [])
  const receiver = useMemo(() => createRemoteReceiver(), [])
  const endpoint = useMemo(() => createEndpoint(fromBrowserExtension(port)), [])

  return <>{JSON.stringify({ port, endpoint })}</>

  console.log({ port, endpoint })

  useEffect(() => {
    // sendReceiverToRemoteContext(receiver.receive)
  }, [receiver])

  return <RemoteRenderer receiver={receiver} controller={controller} />
}

function fromBrowserExtension(port: Runtime.Port): MessageEndpoint {
  return {
    async postMessage(message) {
      return port.postMessage(message)
    },
    addEventListener(event, listener) {
      return window.addEventListener(event, listener)
    },
    removeEventListener(event, listener) {
      return window.removeEventListener(event, listener)
    },
  }
}

export function DevTools() {
  return <BrowserExtensionRenderer />
}

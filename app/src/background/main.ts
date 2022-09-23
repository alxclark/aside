import type { BackgroundApiForContentScript, BackgroundApiForDevTools } from '@companion/background'
import type { ContentScriptApiForBackground } from '@companion/content-script'
import type { DevToolsApi } from '@companion/dev-tools'
import type { Endpoint } from '@remote-ui/rpc'
import { createEndpoint } from '@remote-ui/rpc'
import { fromPort } from '../../../packages/background/src/adaptor'

// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import('/@vite/client')
  // load latest content script
  import('./contentScriptHMR')
}

const devToolsMap = new Map<number, Endpoint<DevToolsApi>>()
const contentScriptMap = new Map<number, Endpoint<ContentScriptApiForBackground>>()

console.log(Date.now())

browser.runtime.onConnect.addListener((port) => {
  const listener = (message: any, senderPort: any): any => {
    const tabId = message?.tabId ?? senderPort?.sender?.tab?.id

    if (message.name === 'init' && tabId) {
      switch (port.name) {
        case 'dev-tools':
        {
          console.log('Received a dev tool port')
          console.log(Date.now())
          const devTools = createEndpoint<DevToolsApi>(fromPort({ port }), {
            callable: ['getDevToolsChannel'],
          })

          const backgroundApiForDevTools: BackgroundApiForDevTools = {
            sendReceiverToContentScript(receiver) {
              const contentScript = contentScriptMap.get(tabId)
              console.log('[BG] sendReceiverToContentScript', { receiver, contentScript })
              contentScript?.call.sendReceiverToWebpage(receiver)
              devTools.call.placeholderForDevTools()
            },
          }

          devTools.expose(backgroundApiForDevTools)

          return devToolsMap.set(tabId, devTools)
        }
        case 'content-script': {
          const contentScript = createEndpoint<ContentScriptApiForBackground>(fromPort({ port }), {
            callable: ['sendReceiverToWebpage'],
          })

          const backgroundApiForContentScript: BackgroundApiForContentScript = {
            getDevToolsChannel() {
              const devTools = devToolsMap.get(tabId)

              if (!devTools)
                throw new Error('Dev tools not available for this tab')

              return devTools.call.getDevToolsChannel()
            },
          }

          contentScript.expose(backgroundApiForContentScript)

          return contentScriptMap.set(tabId, contentScript)
        }
      }
    }
  }

  port.onMessage.addListener(listener)

  port.onDisconnect.addListener((port) => {
    // console.log('removing listener')
    // port.onMessage.removeListener(listener)
    // remove connection from the right map
  })
})

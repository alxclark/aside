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

browser.runtime.onConnect.addListener((port) => {
  const listener = (message: any, senderPort: any): any => {
    const tabId = message?.tabId ?? senderPort?.sender?.tab?.id

    if (message.name === 'init' && tabId) {
      switch (port.name) {
        case 'dev-tools':
        {
          const devTools = createEndpoint<DevToolsApi>(fromPort({ port }), {
            callable: ['getDevToolsChannel'],
          })

          const backgroundApiForDevTools: BackgroundApiForDevTools = {
            sendReceiverToContentScript(_receiver) {},
          }

          devTools.expose(backgroundApiForDevTools)

          port.onDisconnect.addListener(() => {
            devToolsMap.delete(tabId)
            contentScriptMap.get(tabId)?.call.unmountDevTools()
          })

          if (contentScriptMap.get(tabId))
            contentScriptMap.get(tabId)?.call.mountDevTools()

          return devToolsMap.set(tabId, devTools)
        }
        case 'content-script': {
          const contentScript = createEndpoint<ContentScriptApiForBackground>(fromPort({ port }), {
            callable: ['mountDevTools', 'unmountDevTools'],
          })

          const backgroundApiForContentScript: BackgroundApiForContentScript = {
            async getDevToolsChannel() {
              const devTools = devToolsMap.get(tabId)

              if (!devTools)
                throw new Error('Dev tools not available for this tab')

              return await devTools.call.getDevToolsChannel()
            },
          }

          contentScript.expose(backgroundApiForContentScript)

          port.onDisconnect.addListener(() => {
            contentScriptMap.delete(tabId)
          })

          if (devToolsMap.get(tabId))
            contentScript.call.mountDevTools()

          return contentScriptMap.set(tabId, contentScript)
        }
      }
    }
  }

  port.onMessage.addListener(listener)
})

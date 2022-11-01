import type { BackgroundApiForContentScript, BackgroundApiForDevTools } from '@companion/background'
import type { ContentScriptApiForBackground } from '@companion/content-script'
import { createUnsafeEncoder } from '@companion/core'
import type { DevToolsApi } from '@companion/dev-tools'
import type { Endpoint } from '@remote-ui/rpc'
import { createEndpoint } from '@remote-ui/rpc'
import { fromPort } from '@companion/background'
import { setupContentScriptHMR } from '../../foundation/ContentScript'
import { setupDebug } from '../../foundation/Debug'

const devtoolsCache = new Map<number, Endpoint<DevToolsApi>>()
const contentScriptCache = new Map<number, Endpoint<ContentScriptApiForBackground>>()

setupContentScriptHMR()
setupDebug({
  onMessage: (event) => {
    contentScriptCache.forEach((contentScript) => {
      contentScript.call.log('background', ...(event as CustomEvent<any>).detail.message)
    })
  },
})

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
            log(source, ...params) {
              contentScriptCache.get(tabId)?.call.log(source, ...params)
            },
          }

          devTools.expose(backgroundApiForDevTools)

          port.onDisconnect.addListener(() => {
            devtoolsCache.delete(tabId)
            contentScriptCache.get(tabId)?.call.unmountDevTools()
          })

          if (contentScriptCache.has(tabId)) {
            const contentScript = contentScriptCache.get(tabId)!

            contentScript.call.log('background', 'mounting dev tools')
            contentScript.call.mountDevTools()
          }

          return devtoolsCache.set(tabId, devTools)
        }
        case 'content-script': {
          const contentScript = createEndpoint<ContentScriptApiForBackground>(fromPort({ port }), {
            callable: ['mountDevTools', 'unmountDevTools', 'log'],
            createEncoder: createUnsafeEncoder,
          })

          const backgroundApiForContentScript: BackgroundApiForContentScript = {
            async getDevToolsChannel() {
              const devTools = devtoolsCache.get(tabId)

              if (!devTools)
                throw new Error('Dev tools not available for this tab')

              const channel = await devTools.call.getDevToolsChannel()

              return channel
            },
          }

          contentScript.expose(backgroundApiForContentScript)

          port.onDisconnect.addListener(() => {
            contentScriptCache.delete(tabId)
          })

          if (devtoolsCache.has(tabId)) {
            contentScript.call.log('background', 'mounting dev tools')
            contentScript.call.mountDevTools()
          }

          console.log('Adding contentScript for tab:', tabId)

          return contentScriptCache.set(tabId, contentScript)
        }
      }
    }
  }

  port.onMessage.addListener(listener)
})

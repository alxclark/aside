import type { BackgroundApiForContentScript, BackgroundApiForDevTools } from '@companion/background'
import type { ContentScriptApiForBackground } from '@companion/content-script'
import { createUnsafeEncoder } from '@companion/core'
import type { DevToolsApi } from '@companion/dev-tools'
import type { Endpoint } from '@remote-ui/rpc'
import { createEndpoint } from '@remote-ui/rpc'
import { fromPort } from '@companion/background'
import { setupContentScriptHMR } from '../../foundation/ContentScript'

setupContentScriptHMR()

const devToolsMap = new Map<number, Endpoint<DevToolsApi>>()
const contentScriptMap = new Map<number, Endpoint<ContentScriptApiForBackground>>()

function log(...message: any[]) {
  console.log('inside log from background')

  const event = new CustomEvent('companion-log', {
    detail: {
      message,
    },
  })

  window.dispatchEvent(event)
}

window.__companion = { log }

window.addEventListener('companion-log', (event) => {
  contentScriptMap.forEach((contentScript) => {
    contentScript.call.log('background', ...(event as CustomEvent<any>).detail.message)
  })
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
              contentScriptMap.get(tabId)?.call.log(source, ...params)
            },
          }

          devTools.expose(backgroundApiForDevTools)

          port.onDisconnect.addListener(() => {
            devToolsMap.delete(tabId)
            contentScriptMap.get(tabId)?.call.unmountDevTools()
          })

          if (contentScriptMap.has(tabId)) {
            const contentScript = contentScriptMap.get(tabId)!

            contentScript.call.log('background', 'mounting dev tools')
            contentScript.call.mountDevTools()
          }

          return devToolsMap.set(tabId, devTools)
        }
        case 'content-script': {
          const contentScript = createEndpoint<ContentScriptApiForBackground>(fromPort({ port }), {
            callable: ['mountDevTools', 'unmountDevTools', 'log'],
            createEncoder: createUnsafeEncoder,
          })

          const backgroundApiForContentScript: BackgroundApiForContentScript = {
            async getDevToolsChannel() {
              const devTools = devToolsMap.get(tabId)

              if (!devTools)
                throw new Error('Dev tools not available for this tab')

              const channel = await devTools.call.getDevToolsChannel()

              return channel
            },
          }

          contentScript.expose(backgroundApiForContentScript)

          port.onDisconnect.addListener(() => {
            contentScriptMap.delete(tabId)
          })

          if (devToolsMap.has(tabId)) {
            contentScript.call.log('background', 'mounting dev tools')
            contentScript.call.mountDevTools()
          }

          console.log('Adding contentScript for tab:', tabId)

          return contentScriptMap.set(tabId, contentScript)
        }
      }
    }
  }

  port.onMessage.addListener(listener)
})

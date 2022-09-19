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

const devToolsMap = new Map<number, Endpoint<any>>()

browser.runtime.onConnect.addListener((port) => {
  console.log('connection', { port })
  const listener = (message: any): any => {
    console.log({ message })
    if (message.name === 'init' && message.tabId) {
      switch (port.name) {
        case 'dev-tools':
        {
          const endpoint = createEndpoint(fromPort({ port }), {
            callable: ['init'],
          })

          endpoint.expose({
            init() {
              console.log('[BG][dev] init()')
            },
          })

          console.log(Date.now())

          return devToolsMap.set(message.tabId, endpoint)
        }
      }
    }
  }

  port.onMessage.addListener(listener)

  port.onDisconnect.addListener((port) => {
    port.onMessage.removeListener(listener)
    // remove connection from the right map
  })
})

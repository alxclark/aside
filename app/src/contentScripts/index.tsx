import { createEndpoint } from '@remote-ui/rpc'
import React from 'react'
import ReactDOM from 'react-dom'
import type { ContentScriptApi, WebpageApi } from '@companion/content-script'
import { fromContentScript } from '@companion/content-script'
import type { DevToolsApi } from '@companion/dev-tools'
import { App } from './views/App'

const __DEV__ = true;

(() => {
  const background = createEndpoint(fromContentScript({ to: 'background' }), {
    callable: [],
  })

  const devtools = createEndpoint(fromContentScript({ to: 'devtools' }), {
    callable: [],
  })

  const webpage = createEndpoint<ContentScriptApi>(fromContentScript({ to: 'webpage' }), {
    callable: ['mount', 'unmount', 'init'],
  })

  const webpageApi: WebpageApi = {
    init() {
      console.log('[CS][webpage] init()')
    },
  }

  const devToolsApi: DevToolsApi = {
    init() {
      console.log('[CS][devtools] init()')
    },
  }

  devtools.expose(devToolsApi)
  webpage.expose(webpageApi)
})()

// Currently content scripts rendering is not supported.
// The use case of using remote rendering to render back UI
// in the primary webpage doesn't seem to be adding value.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function render() {
  const container = document.createElement('div')
  const root = document.createElement('div')
  const shadowDOM = container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) || container
  shadowDOM.appendChild(root)
  document.body.appendChild(container)

  ReactDOM.render(<App />, root)
}


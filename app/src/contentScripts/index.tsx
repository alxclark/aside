import { createEndpoint } from '@remote-ui/rpc'
import React from 'react'
import ReactDOM from 'react-dom'
import type { ContentScriptApi, WebpageApi } from '@companion/core'
import { fromWebpage } from '@companion/core'
import { App } from './views/App'

const __DEV__ = true;

(() => {
  const port = browser.runtime.connect()
  const webpage = createEndpoint<ContentScriptApi>(fromWebpage({ context: 'contentScript' }), {
    callable: ['mount', 'unmount', 'init'],
  })

  const webpageApi: WebpageApi = {
    init() {
      console.log('Companion component has mounted (logged from content script)')
      // port.postMessage({ type: 'hello_world' })
    },
  }

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


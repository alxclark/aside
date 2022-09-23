import { createEndpoint } from '@remote-ui/rpc'
import React from 'react'
import ReactDOM from 'react-dom'
import type { ContentScriptApiForBackground, ContentScriptApiForWebpage } from '@companion/content-script'
import { fromContentScript } from '@companion/content-script'
import type { WebpageApi } from '@companion/web'
import type { BackgroundApiForContentScript } from '@companion/background'
import { App } from './views/App'

const __DEV__ = true;

(() => {
  const background = createEndpoint<BackgroundApiForContentScript>(fromContentScript({ to: 'background' }), {
    callable: ['getDevToolsChannel'],
  })

  const webpage = createEndpoint<WebpageApi>(fromContentScript({ to: 'webpage' }), {
    callable: ['setReceiver'],
  })

  const contentScriptApiForWebpage: ContentScriptApiForWebpage = {
    getDevToolsChannel() {
      return background.call.getDevToolsChannel()
    },
  }

  const ContentScriptApiForBackground: ContentScriptApiForBackground = {
    sendReceiverToWebpage(receiver) {
      console.log('sending receiver', receiver)
    },
  }

  webpage.expose(contentScriptApiForWebpage)
  background.expose(ContentScriptApiForBackground)
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


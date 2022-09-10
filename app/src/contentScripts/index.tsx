import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './views/App'

const __DEV__ = true;

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(() => {
  // Listen to messages from the extension
  const port = browser.runtime.connect()

  port.onMessage.addListener((message) => {
    // Forward the message to the webpage
    console.log({ message })
    window.postMessage(message, '*')
  })

  port.postMessage({ type: 'content_script_connected' })
})()

// Currently content scripts rendering is not supported.
// The use case of using remote rendering to render back UI
// in the primary context doesn't seem to be adding value.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function render() {
  const container = document.createElement('div')
  const root = document.createElement('div')
  const shadowDOM = container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) || container
  shadowDOM.appendChild(root)
  document.body.appendChild(container)

  ReactDOM.render(<App />, root)
}


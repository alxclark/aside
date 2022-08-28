/* eslint-disable no-console */
import ReactDOM from 'react-dom/client'
import { onMessage } from 'webext-bridge'
import { App } from './views/App'

const __DEV__ = true;

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(() => {
  console.info('[vitesse-webext] Hello world from content script')

  // communication example: send previous tab title from background page
  onMessage('tab-prev', ({ data }) => {
    console.log(`[vitesse-webext] Navigate from page "${data.title}"`)
  })

  // mount component to context window
  const container = document.createElement('div')
  const root = document.createElement('div')
  const shadowDOM = container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) || container
  shadowDOM.appendChild(root)
  document.body.appendChild(container)

  ReactDOM.createRoot(root).render(<App />)
})()


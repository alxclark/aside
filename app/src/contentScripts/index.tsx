import { createEndpoint } from '@remote-ui/rpc'
import type { ContentScriptApiForBackground, ContentScriptApiForWebpage } from '@companion/content-script'
import { fromContentScript } from '@companion/content-script'
import type { WebpageApi } from '@companion/web'
import type { BackgroundApiForContentScript } from '@companion/background'

(() => {
  const background = createEndpoint<BackgroundApiForContentScript>(fromContentScript({ to: 'background' }), {
    callable: ['getDevToolsChannel'],
  })

  const webpage = createEndpoint<WebpageApi>(fromContentScript({ to: 'webpage' }), {
    callable: ['mountDevTools', 'unmountDevTools'],
  })

  const contentScriptApiForWebpage: ContentScriptApiForWebpage = {
    getDevToolsChannel() {
      return background.call.getDevToolsChannel()
    },
  }

  const ContentScriptApiForBackground: ContentScriptApiForBackground = {
    mountDevTools() {
      return webpage.call.mountDevTools()
    },
    unmountDevTools() {
      return webpage.call.unmountDevTools()
    },
  }

  webpage.expose(contentScriptApiForWebpage)
  background.expose(ContentScriptApiForBackground)
})()

import {isForbiddenUrl} from '../../env';
import {setupContentScriptHMR} from '../../foundation/ContentScript';

if (import.meta.env.DEV) {
  setupContentScriptHMR();
}

async function background() {
  browser.webNavigation.onCommitted.addListener(async ({tabId}) => {
    // const port = browser.tabs.connect(tabId, {name: 'background'});
    // console.log({port});
  });

  browser.webNavigation.onCommitted.addListener(({tabId, frameId, url}) => {
    // Filter out non main window events.
    if (frameId !== 0) return;

    if (isForbiddenUrl(url)) return;

    browser.action.setBadgeText({text: 'OFF', tabId});
  });

  browser.runtime.onConnect.addListener((port) => {
    console.log({port});
    console.log('i love ya');
  });

  browser.runtime.onMessage.addListener(async (message, sender) => {
    console.log({message});

    if (message.type === 'mount') {
      browser.action.setBadgeText({text: 'ON', tabId: sender?.tab?.id});
      return true;
    }
  });
}

background();

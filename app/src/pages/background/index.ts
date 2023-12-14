import {
  // WEBPAGE_INITIATED_CONNECTION,
  setupContentScriptHMR,
} from '../../foundation/ContentScript';
// import {isForbiddenUrl} from '../../env';

if (import.meta.env.DEV) {
  setupContentScriptHMR();
}

async function background() {
  // browser.webNavigation.onCommitted.addListener(({frameId, url}) => {
  //   // Filter out non main window events.
  //   if (frameId !== 0) return;

  //   if (isForbiddenUrl(url)) return;

  //   browser.action.setBadgeText({text: 'OFF', tabId});
  // });

  // When the content-script attempts to connect to the devtools panel,
  // it expects at least one listener to be active. Since in most cases,
  // users will browse webpages without the devtools panel open, we need
  // to provide a dummy listener to prevent the connection from failing.
  browser.runtime.onConnect.addListener(() => {});

  // browser.runtime.onMessage.addListener(async (message, sender) => {
  //   if (message.type === WEBPAGE_INITIATED_CONNECTION) {
  //     browser.action.setIcon({
  //       tabId: sender?.tab?.id,
  //       path: {
  //         16: '/assets/logo-16-disabled.png',
  //         48: '/assets/logo-16-disabled.png',
  //         128: '/assets/logo-16-disabled.png',
  //       },
  //     });
  //     return true;
  //   }
  // });
}

background();

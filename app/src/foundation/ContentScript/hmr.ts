import {isFirefox, isForbiddenUrl} from '../../env';

// Firefox fetch files from cache instead of reloading changes from disk,
// hmr will not work as Chromium based browser
export function setupContentScriptHMR() {
  browser.webNavigation.onCommitted.addListener(({tabId, frameId, url}) => {
    // Filter out non main window events.
    if (frameId !== 0) return;

    if (isForbiddenUrl(url)) return;

    // inject the latest scripts
    browser.scripting
      .executeScript({
        target: {tabId},
        files: [`${isFirefox ? '' : '.'}/dist/contentScripts/index.global.js`],
      } as any)
      .catch((error) => console.error(error));
  });
}

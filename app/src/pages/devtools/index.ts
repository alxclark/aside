import {Runtime} from 'webextension-polyfill';

let portDev: Runtime.Port;
let portTab: Runtime.Port;
const tabId = browser.devtools.inspectedWindow.tabId;
const onDevMessage = (msg: any) => portTab.postMessage(msg);
const onTabMessage = (msg: any) => portDev.postMessage(msg);

// 1. Connect to content-script
// 2. Forward messages from content-script to dev tools
// 3. Forward messages from dev tools to content-script
browser.runtime.onConnect.addListener((port) => {
  // console.log({port});
  // if (Number(port.name) !== tabId) return;
  // portDev = port;
  // portDev.onMessage.addListener(onDevMessage);
  // portTab = browser.tabs.connect(tabId, {name: 'dev'});
  // portTab.onMessage.addListener(onTabMessage);
  // console.log({portTab});
});

browser.devtools.panels.create('Aside', '', 'dist/pages/devtools/panel.html');

// Case where CS loads first
// 1- CS (injected first) (no port)
// 2- Dev adds onConnect listener (no port)
// 3- panel loads, connects to dev (+port in panel)
// 4- Dev uses tabId and connects to CS
// 5- onConnect in CS receives port (+port in CS)
// 6- Sends ack to dev

// Case where CS loads after dev
// 1- Dev adds onConnect listener (no port)
// 2- panel loads, connexts to dev (+port in panel)
// 3- Dev uses tabId and "attempt" to connect to CS
// 4- No ack from CS
// 5- CS loads, attempt to connect to runtime
// 6- Dev interceps message, accepts the port
// 7- Dev sends message to CS to mount

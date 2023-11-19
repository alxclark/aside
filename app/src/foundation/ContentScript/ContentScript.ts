import {Runtime} from 'webextension-polyfill';
import {effect} from '@preact/signals-core';

import {createReducer} from './reducer';

export function contentScript() {
  const [stateSignal, dispatch] = createReducer({
    devtools: {
      ready: false,
    },
    webpage: {
      ready: false,
    },
  });

  // Initialize content-script.
  // Some of the initialization cannot be done in the initial reducer state
  // we provide above. For example, the webpage endpoint needs to be able
  // to dispatch state changes, but this causes a chicken and egg problem.
  dispatch({type: 'init'});

  // Subscribe to ready events and mount app
  effect(function mountWhenReady() {
    if (stateSignal.value.devtools.ready && stateSignal.value.webpage.ready) {
      stateSignal.value.webpage.endpoint.call.mountDevtools();
    }
  });

  // Attempt to establish a port with the devtools panel.
  // Depending on the timing of which script loads first,
  // different means of connection are used.

  // 1. Attempt to connect to devtools
  // in case the devtools loaded first.
  const contentScriptPort = browser.runtime.connect({
    name: 'content-script',
  });

  contentScriptPort.onMessage.addListener(onAcceptedPortListener);
  async function onAcceptedPortListener(
    message: any,
    devtoolsPort: Runtime.Port,
  ) {
    if (message?.type === 'accept-port' && message?.sender === 'dev') {
      dispatch({type: 'devtools-ready', port: devtoolsPort});

      devtoolsPort.onDisconnect.addListener(() => {
        dispatch({
          type: 'devtools-disconnected',
          port: devtoolsPort,
        });
      });
    }
  }

  // 2. Listen to runtime connection
  // in case the webpage loaded first.
  browser.runtime.onConnect.addListener(onConnectListener);
  async function onConnectListener(devtoolsPort: Runtime.Port) {
    devtoolsPort.postMessage({type: 'accept-port', sender: 'content-script'});

    const listener = (message: any) => {
      if (message.type === 'ready' && message.sender === 'dev') {
        dispatch({type: 'devtools-ready', port: devtoolsPort});

        devtoolsPort.onDisconnect.addListener(() => {
          dispatch({
            type: 'devtools-disconnected',
            port: devtoolsPort,
          });
        });
      }
    };
    devtoolsPort.onMessage.addListener(listener);
  }
}

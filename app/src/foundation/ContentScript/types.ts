import {DevtoolsApiForContentScript, WebpageApi} from '@aside/core';
import {Endpoint} from '@remote-ui/rpc';
import {Runtime} from 'webextension-polyfill';

export interface State {
  webpage: Webpage;
  devtools: Devtools;
}

/**
 * The state of the webpage.
 * When the content-script creates the endpoint,
 * it exists but we don't know if the webpage has connected yet
 * and is ready to mount the app.
 */
export type Webpage =
  | {
      ready: false;
      endpoint?: Endpoint<WebpageApi>;
    }
  | {
      ready: true;
      endpoint: Endpoint<WebpageApi>;
    };

/**
 * The state of the devtools.
 * Contrary to the webpage, the endpoint can't be created
 * ahead of time, and we need to wait until a port connects
 * to the content-script.
 */
export type Devtools =
  | {
      ready: false;
    }
  | {
      ready: true;
      port: Runtime.Port;
      endpoint: Endpoint<DevtoolsApiForContentScript>;
    };

export type Action =
  | {type: 'init'}
  | {type: 'webpage-ready'}
  | {type: 'devtools-ready'; port: Runtime.Port}
  | {type: 'devtools-disconnected'; port: Runtime.Port};

export type Dispatch = (action: Action) => void;

import {RemoteChannel} from '@remote-ui/core';

type AnyFunction = (...args: any[]) => any;
interface RemoteApi {
  [key: string]: AnyFunction | undefined;
}

// Content-script

export interface ContentScriptApiForWebpage extends RemoteApi {
  getDevToolsChannel(): Promise<RemoteChannel>;
  getLocalStorage(
    keys?: string | {[key: string]: any} | string[] | null | undefined,
  ): Promise<{[key: string]: any}>;
  setLocalStorage(items: {[key: string]: any}): Promise<void>;
}

export interface ContentScriptApiForDevTools extends RemoteApi {
  mountDevTools(): void;
  unmountDevTools(): void;
  log(source: string, ...params: any[]): void;
}

// Dev tools

export interface DevToolsApiForContentScript extends RemoteApi {
  getDevToolsChannel(): RemoteChannel;
  renewReceiver(): void;
}

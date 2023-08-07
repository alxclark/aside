import {RemoteChannel} from '@remote-ui/core';
import {
  RemoteSubscribable,
  StatefulRemoteSubscribable,
} from '@remote-ui/async-subscription';

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
  getApi(): Promise<ExtensionApi>;
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
  getApi(): ExtensionApi;
}

export interface ExtensionApi {
  network: {
    requests: RemoteSubscribable<NetworkRequest[]>;
  };
}

export interface StatefulExtensionApi {
  network: {
    requests: StatefulRemoteSubscribable<NetworkRequest[]>;
  };
}

export interface NetworkRequest {
  type: string;
  time: number;
  request: {
    url: string;
  };
}

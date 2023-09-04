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
    clear(): void;
    requests: RemoteSubscribable<NetworkRequest[]>;
    onRequestFinished(callback: (request: NetworkRequest) => void): () => void;
  };
}

export interface StatefulExtensionApi {
  network: {
    clear(): void;
    requests: StatefulRemoteSubscribable<NetworkRequest[]>;
    onRequestFinished(callback: (request: NetworkRequest) => void): () => void;
  };
}

export interface NetworkApi {
  clear(): void;
  requests: NetworkRequest[];
  onRequestFinished(callback: (request: NetworkRequest) => void): () => void;
}

export interface NetworkRequest {
  _resourceType: 'image' | 'script' | 'preflight' | 'fetch' | 'websocket';
  time: number;
  startedDateTime: string;
  request: PostRequest | BaseRequest<'GET'> | BaseRequest<'PUT'>;
}

interface PostRequest extends BaseRequest<'POST'> {
  method: 'POST';
  postData: {
    mimeType: string;
    text: string;
  };
}

interface BaseRequest<T = string> {
  method: T;
  httpVersion: string;
  queryString: string;
  url: string;
}

export interface WebpageApi extends RemoteApi {
  mountDevTools(): void;
  unmountDevTools(): void;
  log(source: string, ...params: any): void;
  resetChannel(): void;
}

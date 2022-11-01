import {RemoteChannel} from '@remote-ui/core'

type AnyFunction = (...args: any[]) => any;
type RemoteApi = Record<string, AnyFunction | undefined>;

// Content-script

export interface ContentScriptApiForWebpage extends RemoteApi {
  getDevToolsChannel(): Promise<RemoteChannel>;
}

export interface ContentScriptApiForBackground extends RemoteApi {
  mountDevTools(): void;
  unmountDevTools(): void;
  log(source: string, ...params: any[]): void;
}

// Background

export interface BackgroundApiForContentScript extends RemoteApi {
  getDevToolsChannel(): Promise<RemoteChannel>;
}

export interface BackgroundApiForDevTools extends RemoteApi {
  log(source: string, ...params: any[]): void;
}

// Dev tools

export interface DevToolsApi extends RemoteApi {
  getDevToolsChannel(): RemoteChannel;
}
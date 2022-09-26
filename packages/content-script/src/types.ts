import {RemoteChannel} from '@remote-ui/core'

type AnyFunction = (...args: any[]) => any;
type RemoteApi = Record<string, AnyFunction | undefined>;

export interface ContentScriptApiForWebpage extends RemoteApi {
  getDevToolsChannel(): Promise<RemoteChannel>;
}

export interface ContentScriptApiForBackground extends RemoteApi {
  mountDevTools(): void;
  unmountDevTools(): void;
}
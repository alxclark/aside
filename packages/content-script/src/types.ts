import {RemoteChannel} from '@remote-ui/core'

type AnyFunction = (...args: any[]) => any;
type RemoteApi = Record<string, AnyFunction | undefined>;

export interface ContentScriptApiForWebpage extends RemoteApi {
  placeholderForContentScript(): void;
}

export interface ContentScriptApiForBackground extends RemoteApi {
  sendReceiverToWebpage(receiver: RemoteChannel): void;
}
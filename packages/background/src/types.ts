import {RemoteChannel} from '@remote-ui/core'

type AnyFunction = (...args: any[]) => any;
type RemoteApi = Record<string, AnyFunction | undefined>;

export interface BackgroundApiForContentScript extends RemoteApi {
  getDevToolsChannel(): Promise<RemoteChannel>;
}

export interface BackgroundApiForDevTools extends RemoteApi {
  sendReceiverToContentScript(receiver: RemoteChannel): void;
}
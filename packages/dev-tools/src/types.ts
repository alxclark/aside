import {RemoteChannel} from '@remote-ui/core'

type AnyFunction = (...args: any[]) => any;
type RemoteApi = Record<string, AnyFunction | undefined>;

export interface DevToolsApi extends RemoteApi {
  getDevToolsChannel(): RemoteChannel;
}
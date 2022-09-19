type AnyFunction = (...args: any[]) => any;
type RemoteApi = Record<string, AnyFunction | undefined>;

export interface DevToolsApi extends RemoteApi {
  init(): void;
}
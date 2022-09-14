type AnyFunction = (...args: any[]) => any;
type RemoteApi = Record<string, AnyFunction | undefined>;

export interface ContentScriptApi extends RemoteApi {
  mount(): void;
  unmount(): void;
}

export interface WebpageApi extends RemoteApi {
  init(): void;
}
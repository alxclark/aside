type AnyFunction = (...args: any[]) => any;
interface RemoteApi {
  [key: string]: AnyFunction | undefined;
}

export interface ContentScriptApi extends RemoteApi {
  mount(): void;
  unmount(): void;
}

export interface WebpageApi extends RemoteApi {
  init(): void;
}

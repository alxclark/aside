type AnyFunction = (...args: any[]) => any;
type RemoteApi = Record<string, AnyFunction | undefined>;

export interface WebpageApi extends RemoteApi {
  mountDevTools(): void;
  unmountDevTools(): void;
}
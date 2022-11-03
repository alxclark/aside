type AnyFunction = (...args: any[]) => any;
interface RemoteApi {
  [key: string]: AnyFunction | undefined;
}

export interface WebpageApi extends RemoteApi {
  mountDevTools(): void;
  unmountDevTools(): void;
  log(source: string, ...params: any): void;
}

import {SetStateAction} from './types';

export interface ExtensionApi {
  network: NetworkApi;
  storage: StorageApi;
  activity: ActivityApi;
}

export interface NetworkApi {
  requests: NetworkRequest[];
  clear(): void;
  onRequestFinished(
    callback: (request: NetworkRequest) => void,
  ): Promise<() => void>;
}

export interface StorageApi {
  local: {
    get(
      keys?: string | {[key: string]: any} | string[] | null | undefined,
    ): Promise<{[key: string]: any}>;
    set(items: {[key: string]: any}): Promise<void>;
  };
}

export type GetterSetterTuple<T> = [T, (value: SetStateAction<T>) => void];

export interface ActivityApi {
  preserveLog: GetterSetterTuple<boolean>;
  recordSnapshot: GetterSetterTuple<boolean>;
  invertFilter: GetterSetterTuple<boolean>;
  showFilter: GetterSetterTuple<boolean>;
  filter: GetterSetterTuple<string>;
  showPreviousValues: GetterSetterTuple<boolean>;
  showTimelineOptions: GetterSetterTuple<boolean>;
}

export interface NetworkRequest {
  _resourceType: 'image' | 'script' | 'preflight' | 'fetch' | 'websocket';
  time: number;
  startedDateTime: string;
  request: PostRequest | BaseRequest<'GET'> | BaseRequest<'PUT'>;
}

export interface PostRequest extends BaseRequest<'POST'> {
  method: 'POST';
  postData: {
    mimeType: string;
    text: string;
  };
}

export interface BaseRequest<T = string> {
  method: T;
  httpVersion: string;
  queryString: string;
  url: string;
}

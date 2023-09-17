import {RemoteChannel} from '@remote-ui/core';
import {
  RemoteSubscribable,
  StatefulRemoteSubscribable,
} from '@remote-ui/async-subscription';

import {ExtensionApi, NetworkApi, NetworkRequest, StorageApi} from './api';
import {SetStateAction} from './types';

export type GetterSetterSubscribableTuple<T> = [
  RemoteSubscribable<T>,
  (value: SetStateAction<T>) => void,
];

export type AsyncGetterSetterSubscribableTuple<T> = [
  RemoteSubscribable<T>,
  (value: SetStateActionWithProxy<T>) => void,
];

export type GetterSetterStatefulSubscribableTuple<T> = [
  StatefulRemoteSubscribable<T>,
  (value: SetStateAction<T>) => void,
];

export interface ApiContext {
  __futureApiContext: null;
}

export interface ApiCreator<T> {
  api(context: ApiContext): Promise<T>;
}

export interface ApiCreatorWithReset<T> extends ApiCreator<T> {
  reset(): void;
}

export type SetStateProxy<T> = (prevState: T) => Promise<T>;
export type SetStateActionWithProxy<T> = T | SetStateProxy<T>;

export type StatelessExtensionApi = Omit<
  ExtensionApi,
  'network' | 'activity'
> & {
  network: Omit<NetworkApi, 'requests'> & {
    requests: RemoteSubscribable<NetworkRequest[]>;
  };
  activity: {
    preserveLog: GetterSetterSubscribableTuple<boolean>;
    recordSnapshot: GetterSetterSubscribableTuple<boolean>;
    invertFilter: GetterSetterSubscribableTuple<boolean>;
    showFilter: GetterSetterSubscribableTuple<boolean>;
    filter: GetterSetterSubscribableTuple<string>;
    showPreviousValues: GetterSetterSubscribableTuple<boolean>;
    showTimelineOptions: GetterSetterSubscribableTuple<boolean>;
  };
  storage: StorageApi;
};

export type StatelessExtensionApiOnHost = Omit<
  ExtensionApi,
  'network' | 'activity'
> & {
  network: Omit<NetworkApi, 'requests'> & {
    requests: RemoteSubscribable<NetworkRequest[]>;
  };
  activity: {
    preserveLog: AsyncGetterSetterSubscribableTuple<boolean>;
    recordSnapshot: AsyncGetterSetterSubscribableTuple<boolean>;
    invertFilter: AsyncGetterSetterSubscribableTuple<boolean>;
    showFilter: AsyncGetterSetterSubscribableTuple<boolean>;
    filter: AsyncGetterSetterSubscribableTuple<string>;
    showPreviousValues: AsyncGetterSetterSubscribableTuple<boolean>;
    showTimelineOptions: AsyncGetterSetterSubscribableTuple<boolean>;
  };
  storage: StorageApi;
};

export type StatefullExtensionApi = Omit<
  ExtensionApi,
  'network' | 'activity'
> & {
  network: Omit<NetworkApi, 'requests'> & {
    requests: StatefulRemoteSubscribable<NetworkRequest[]>;
  };
  activity: {
    preserveLog: GetterSetterStatefulSubscribableTuple<boolean>;
    recordSnapshot: GetterSetterStatefulSubscribableTuple<boolean>;
    invertFilter: GetterSetterStatefulSubscribableTuple<boolean>;
    showFilter: GetterSetterStatefulSubscribableTuple<boolean>;
    filter: GetterSetterStatefulSubscribableTuple<string>;
    showPreviousValues: GetterSetterStatefulSubscribableTuple<boolean>;
    showTimelineOptions: GetterSetterStatefulSubscribableTuple<boolean>;
  };
};

export interface ContentScriptApiForWebpage extends RemoteApi {
  getRemoteChannel(): Promise<RemoteChannel>;
  getLocalStorage(
    keys?: string | {[key: string]: any} | string[] | null | undefined,
  ): Promise<{[key: string]: any}>;
  setLocalStorage(items: {[key: string]: any}): Promise<void>;
  getApi(): Promise<StatelessExtensionApi>;
}

export interface ContentScriptApiForDevtools extends RemoteApi {
  mountDevtools(): void;
  unmountDevtools(): void;
  log(source: string, ...params: any[]): void;
}

// Dev tools

export interface DevtoolsApiForContentScript extends RemoteApi {
  getRemoteChannel(): RemoteChannel;
  getApi(): Promise<StatelessExtensionApi>;
}

export interface WebpageApi extends RemoteApi {
  mountDevtools(): void;
  unmountDevtools(): void;
  log(source: string, ...params: any): void;
}

type AnyFunction = (...args: any[]) => any;
interface RemoteApi {
  [key: string]: AnyFunction | undefined;
}

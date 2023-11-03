import {
  type ActivityApi,
  type NetworkRequest,
  type StorageApi,
} from '@aside/core';
import {type StatefulRemoteSubscribable} from '@remote-ui/async-subscription';

export interface ExtensionApi {
  network: {
    clear(): void;
    requests: StatefulRemoteSubscribable<NetworkRequest[]>;
    onRequestFinished(
      callback: (request: NetworkRequest) => void,
    ): Promise<() => void>;
  };
  storage: StorageApi;
  activity: ActivityApi;
}

import {ActivityApi, NetworkRequest, StorageApi} from '@aside/core';
import {StatefulRemoteSubscribable} from '@remote-ui/async-subscription';

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

import {NetworkRequest} from '@aside/core';
import {SetStateAction} from 'react';
import {StatefulRemoteSubscribable} from '@remote-ui/async-subscription';

type LocalStorageState<T> = [
  {data: T; loading: boolean},
  (value: SetStateAction<T>) => void,
];

export interface ExtensionApi {
  network: {
    requests: StatefulRemoteSubscribable<NetworkRequest[]>;
  };
  storage: {
    local: {
      get(
        keys?: string | {[key: string]: any} | string[] | null | undefined,
      ): Promise<{[key: string]: any}>;
      set(items: {[key: string]: any}): Promise<void>;
    };
  };
  timeline: {
    preserveLog: LocalStorageState<boolean>;
    recordSnapshot: LocalStorageState<boolean>;
    invertFilter: LocalStorageState<boolean>;
    showFilter: LocalStorageState<boolean>;
    filter: LocalStorageState<string>;
    showPreviousValues: LocalStorageState<boolean>;
    showTimelineOptions: LocalStorageState<boolean>;
  };
  activity: {
    preserveLog: LocalStorageState<boolean>;
    recordSnapshot: LocalStorageState<boolean>;
    invertFilter: LocalStorageState<boolean>;
    showFilter: LocalStorageState<boolean>;
    filter: LocalStorageState<string>;
    showPreviousValues: LocalStorageState<boolean>;
    showTimelineOptions: LocalStorageState<boolean>;
  };
}

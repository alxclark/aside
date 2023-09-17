import {ApiCreatorWithReset, StatelessExtensionApiOnHost} from '@aside/core';
import {useMemo} from 'react';

import {useNetworkApi} from './network';
import {useStorageApi} from './storage';
import {useActivityApi} from './activity';

export function useApi(): ApiCreatorWithReset<StatelessExtensionApiOnHost> {
  const network = useNetworkApi();
  const activity = useActivityApi();
  const storage = useStorageApi();

  return useMemo(() => {
    const createApi: ApiCreatorWithReset<StatelessExtensionApiOnHost>['api'] =
      async (context) => {
        const api: StatelessExtensionApiOnHost = {
          network: await network.api(context),
          activity: await activity.api(context),
          storage: await storage.api(context),
        };

        return api;
      };

    const reset = () => {
      network.reset();
      activity.reset();
    };

    return {api: createApi, reset};
  }, [activity, network, storage]);
}

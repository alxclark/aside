import {ApiCreator, StatelessExtensionApiOnHost} from '@aside/core';
import {useMemo} from 'react';

import {useNetworkApi} from './network';
import {useStorageApi} from './storage';
import {useActivityApi} from './activity';

export function useApi(): ApiCreator<StatelessExtensionApiOnHost> {
  const network = useNetworkApi();
  const activity = useActivityApi();
  const storage = useStorageApi();

  return useMemo(() => {
    const createApi: ApiCreator<StatelessExtensionApiOnHost>['api'] = async (
      context,
    ) => {
      const [activityApi, resetActivity] = await activity.api(context);
      const [networkApi, resetNetwork] = await network.api(context);
      const [storageApi] = await storage.api(context);

      const api: StatelessExtensionApiOnHost = {
        network: networkApi,
        activity: activityApi,
        storage: storageApi,
      };

      const reset = () => {
        resetNetwork();
        resetActivity();
      };

      return [api, reset];
    };

    return {api: createApi};
  }, [activity, network, storage]);
}

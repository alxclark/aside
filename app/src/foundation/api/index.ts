import {ExtensionApi} from '@aside/core';
import {useMemo} from 'react';

import {useNetworkApi} from './network';

export function useApi(): [ExtensionApi, () => void] {
  const network = useNetworkApi();

  return useMemo(() => {
    const api: ExtensionApi = {
      network: network.api,
    };

    const reset = () => {
      network.reset();
    };

    return [api, reset];
  }, [network]);
}

import {ApiCreator, StatelessExtensionApiOnHost} from '@aside/core';
import {useMemo} from 'react';

export function useStorageApi(): ApiCreator<
  StatelessExtensionApiOnHost['storage']
> {
  return useMemo(
    () => ({
      api: async () => {
        const local: StatelessExtensionApiOnHost['storage']['local'] = {
          get: (keys) => {
            return browser.storage.local.get(keys);
          },
          set: (items) => {
            return browser.storage.local.set(items);
          },
        };

        return [{local}, () => {}];
      },
    }),
    [],
  );
}

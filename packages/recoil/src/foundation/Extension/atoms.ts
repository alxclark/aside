import {ExtensionApi} from '@aside/react';
import {atom, AtomEffect} from 'recoil';

import {createKey} from '../../utilities/recoil';

export const extensionApiAtom = atom<ExtensionApi | undefined>({
  key: createKey('extension-api'),
  default: undefined,
});

interface SyncStorageEffectOptions {}

export const STORAGE_KEY = '__aside_extension_storage';

export const syncStorageEffect: (
  options?: SyncStorageEffectOptions,
) => AtomEffect<any> =
  () =>
  ({getLoadable, node, trigger, onSet}) => {
    async function persistToExtensionStorage() {
      if (trigger === 'get') {
        const api = getLoadable(extensionApiAtom).getValue();

        if (!api) return;

        onSet(async (value) => {
          api.storage.local.set({
            [node.key]: value,
          });
        });
      }
    }
    persistToExtensionStorage();
  };

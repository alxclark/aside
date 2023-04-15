import {ExtensionApi} from '@aside/react';
import {atom, AtomEffect} from 'recoil';

import {createKey} from '../../utilities/recoil';

export const extensionApiAtom = atom<ExtensionApi | undefined>({
  key: createKey('extension-api'),
  default: undefined,
});

export const syncStorageEffect: AtomEffect<any> = ({
  getLoadable,
  setSelf,
  node,
  trigger,
  onSet,
}) => {
  async function persistToExtensionStorage() {
    if (trigger === 'get') {
      const api = getLoadable(extensionApiAtom).getValue();

      if (!api) return;

      const result = await api.storage.local.get(node.key);

      const isEmptyObject =
        result &&
        Object.keys(result).length === 0 &&
        Object.getPrototypeOf(result) === Object.prototype;

      if (!isEmptyObject) {
        setSelf((result as any)[node.key]);
      }

      onSet((value) => {
        api.storage.local.set({[node.key]: value});
      });
    }
  }
  persistToExtensionStorage();
};

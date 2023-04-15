import {ExtensionApi} from '@aside/react';
import {atom, AtomEffect} from 'recoil';

import {createKey} from '../../utilities/recoil';

export const extensionApiAtom = atom<ExtensionApi | undefined>({
  key: createKey('extension-api'),
  default: undefined,
});

interface SyncStorageEffectOptions {
  /**
   * Specifies how to reconcile the state being retrieved from storage.
   *
   * `overwrite` (Default): Completely replaces the initial state of the atom.
   *
   * `mergeBefore`: The initial atom state will be merged into the persisted state.
   *
   * *example*: [...persisted, ...initial]
   *
   * `mergeAfter`: The persisted atom state will be merged into the initial state.
   *
   * *example*: [...initial, ...persisted]
   */
  reconciliation?: 'overwrite' | 'mergeBefore' | 'mergeAfter';
}

export const syncStorageEffect: (
  options?: SyncStorageEffectOptions,
) => AtomEffect<any> =
  (options) =>
  ({getLoadable, setSelf, node, trigger, onSet}) => {
    async function persistToExtensionStorage() {
      if (trigger === 'get') {
        const reconciliation = options?.reconciliation ?? 'overwrite';

        const api = getLoadable(extensionApiAtom).getValue();

        if (!api) return;

        const persistedValue = await api.storage.local.get(node.key);

        const isEmptyObject =
          persistedValue &&
          Object.keys(persistedValue).length === 0 &&
          Object.getPrototypeOf(persistedValue) === Object.prototype;

        const initialValue = getLoadable(node).getValue();

        if (!isEmptyObject) {
          switch (reconciliation) {
            case 'overwrite': {
              setSelf(persistedValue[node.key]);
              break;
            }
            case 'mergeBefore': {
              const reconciliatedValue = getReconciliatedValue(
                persistedValue[node.key],
                initialValue,
              );
              setSelf(reconciliatedValue);
              break;
            }
            case 'mergeAfter': {
              const reconciliatedValue = getReconciliatedValue(
                initialValue,
                persistedValue[node.key],
              );
              setSelf(reconciliatedValue);
              break;
            }
          }
        }

        onSet((value) => {
          api.storage.local.set({[node.key]: value});
        });
      }
    }
    persistToExtensionStorage();
  };

function getReconciliatedValue<T>(previous: T, newValue: T) {
  if (Array.isArray(previous) && Array.isArray(newValue)) {
    return [...previous, ...newValue];
  }

  if (typeof previous === 'object' && typeof newValue === 'object') {
    return {...previous, ...newValue};
  }

  return newValue;
}

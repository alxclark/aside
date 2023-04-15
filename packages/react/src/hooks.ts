import {useContext} from 'react';

import {ExtensionApiContext} from './context';

export function useExtensionApi() {
  const api = useContext(ExtensionApiContext);

  if (!api) {
    throw new Error('No extension api context found');
  }

  return api;
}

import {useContext} from 'react';

import {RendererContext} from './context';

export function useRenderer() {
  const renderer = useContext(RendererContext);

  if (!renderer) {
    throw new Error('No RendererContext available');
  }

  return renderer;
}

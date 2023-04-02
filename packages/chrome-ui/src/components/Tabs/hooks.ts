import {useContext} from 'react';

import {TabsContext} from './context';

export function useTabs() {
  const tabs = useContext(TabsContext);

  if (!tabs) {
    throw new Error('No TabsContext available');
  }

  return tabs;
}

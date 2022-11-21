import {useContext} from 'react';

import {NavigationContext, NavigationContextType} from './context';

export function useNavigation(): NavigationContextType {
  const navigation = useContext(NavigationContext);

  if (!navigation) {
    throw new Error(
      'There is no NavigationContext available. Make sure the component is wrapped in a <Navigation /> component',
    );
  }

  return navigation;
}

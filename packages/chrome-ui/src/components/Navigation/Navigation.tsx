import React, {PropsWithChildren, useEffect, useMemo, useState} from 'react';

import {NavigationContext, NavigationContextType} from './context';

export type Props = PropsWithChildren<{
  initial?: string;
  selected?: string;
  navigate?: (value: string) => void;
}>;

export function Navigation({
  children,
  initial,
  navigate: explicitNavigate,
  selected: explicitSelected,
}: Props) {
  const [selected, setSelected] = useState<string>(
    initial ?? explicitSelected ?? '',
  );

  useEffect(() => {
    if (explicitSelected && explicitSelected !== selected) {
      setSelected(explicitSelected);
    }
  }, [explicitSelected, selected]);

  const navigation = useMemo<NavigationContextType>(
    () => ({selected, navigate: explicitNavigate ?? setSelected}),
    [explicitNavigate, selected],
  );

  return (
    <NavigationContext.Provider value={navigation}>
      <nav className="bg-gray-500 w-full min-h-[26px] border-b border-gray-400">
        {children}
      </nav>
    </NavigationContext.Provider>
  );
}

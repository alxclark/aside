import React, {PropsWithChildren, useCallback, useMemo} from 'react';
import classNames from 'classnames';

import {useTabs} from './hooks';
import {TabsContext} from './context';
import {TabsContextType} from './types';

export type Props = PropsWithChildren<TabsContextType>;

export function Tabs({selected, setSelected, children}: Props) {
  const context: TabsContextType = useMemo(
    () => ({selected, setSelected}),
    [selected, setSelected],
  );

  return (
    <TabsContext.Provider value={context}>{children}</TabsContext.Provider>
  );
}

export interface TabProps {
  label: string;
  id: string;
}

export function Tab({label, id}: TabProps) {
  const {selected, setSelected} = useTabs();

  const className = classNames(
    'h-[26px] px-3 font-sans cursor-default',
    selected !== id && 'text-gray-300 hover:text-white hover:bg-elevation-2',
    selected === id && 'bg-black text-white',
  );

  const handleClick = useCallback(() => {
    setSelected(id);
  }, [setSelected, id]);

  return (
    <button className={className} onClick={handleClick}>
      {label}
    </button>
  );
}

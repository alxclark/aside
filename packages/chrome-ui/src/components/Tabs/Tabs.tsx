import React, {useCallback, useMemo} from 'react';
import classNames from 'classnames';
import {TabsProps, TabProps} from '@aside/chrome-ui-remote';

import {useTabs} from './hooks';
import {TabsContext} from './context';
import {TabsContextType} from './types';

export type {TabsProps, TabProps};

export function Tabs({selected, setSelected = () => {}, children}: TabsProps) {
  const context: TabsContextType = useMemo(
    () => ({selected, setSelected}),
    [selected, setSelected],
  );

  return (
    <TabsContext.Provider value={context}>{children}</TabsContext.Provider>
  );
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

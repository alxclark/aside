import React, {useMemo} from 'react';

import {Renderer} from './components';
import {RendererContext} from './context';
import {RendererContextType} from './types';

export interface LogItem {
  id: string;
  value: any;
  onPress?: () => void;
}

export interface Props {
  items: LogItem[];
  showDiffs?: boolean;
}

export function Log({items, showDiffs = false}: Props) {
  const context = useMemo<RendererContextType>(
    () => ({showDiffs}),
    [showDiffs],
  );

  return (
    <RendererContext.Provider value={context}>
      <div className="px-6 py-[2px] font-menlo text-code-gray text-[11px] border-b border-gray-400">
        {items.map((item) => (
          <Renderer key={item.id} value={item.value} />
        ))}
      </div>
    </RendererContext.Provider>
  );
}

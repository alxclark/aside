import React from 'react';

import {Renderer} from './components';

export interface LogItem {
  id: string;
  value: any;
  onPress?: () => void;
}

export interface Props {
  items: LogItem[];
}

export function Log({items}: Props) {
  return (
    <div className="px-6 py-[2px] font-menlo text-code-gray text-[11px] border-b">
      {items.map((item) => (
        <Renderer key={item.id} value={item.value} />
      ))}
    </div>
  );
}

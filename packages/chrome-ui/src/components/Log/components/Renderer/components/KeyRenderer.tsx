import React from 'react';

import {Carret} from '../../../../Carret';

export function KeyRenderer({
  path,
  collapsible = true,
  collapsed = true,
  onPress,
}: {
  path: string[];
  collapsible?: boolean;
  collapsed?: boolean;
  onPress?: () => void;
}) {
  const key = path[path.length - 1];

  return (
    <span
      className="text-left mr-[7px] relative"
      onKeyDown={onPress}
      onClick={onPress}
    >
      {collapsible && (
        <div className="absolute left-[-10px] top-[-2px]">
          <Carret direction={collapsed ? 'right' : 'down'} />
        </div>
      )}
      <span className="text-console-object-blue font-bold">{key}</span>:
    </span>
  );
}

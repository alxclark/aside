import React from 'react';
import classNames from 'classnames';

export function NumberRenderer({
  value,
  path,
  collapsed,
}: {
  value: number;
  path: string[];
  collapsed?: boolean;
}) {
  return (
    <>
      <span
        className={classNames(
          'text-console-object-gray',
          !collapsed && 'text-console-object-blue font-bold',
        )}
      >
        {path[path.length - 1]}
      </span>
      : <span className="text-console-object-purple">{value}</span>
    </>
  );
}

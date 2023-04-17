import React from 'react';
import classNames from 'classnames';

export function NumberRenderer({
  value,
  path,
  collapsed,
  previousValue,
  showDiffs,
}: {
  value: number;
  path: string[];
  collapsed?: boolean;
  previousValue?: number;
  showDiffs?: boolean;
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
      :{' '}
      {showDiffs && (
        <>
          <span className="text-console-object-purple">{previousValue}</span>
          <span className="text-white">{' → '}</span>
        </>
      )}
      <span className="text-console-object-purple">{value}</span>
    </>
  );
}

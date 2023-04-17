import React from 'react';
import classNames from 'classnames';

export function StringRenderer({
  value,
  path,
  collapsed,
  previousValue,
  showDiffs,
}: {
  value: string;
  path: string[];
  collapsed?: boolean;
  previousValue?: string;
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
      <span className="text-console-object-cyan">
        {showDiffs && `${previousValue} →`} &apos;{value}&apos;
      </span>
    </>
  );
}

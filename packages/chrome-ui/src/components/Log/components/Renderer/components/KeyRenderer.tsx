import React from 'react';
import classNames from 'classnames';

import {Carret} from '../../../../Carret';
import {useRenderer} from '../../../hooks';

export function KeyRenderer({
  path,
  collapsible = true,
  preview,
}: {
  path: string[];
  collapsible?: boolean;
  preview?: boolean;
}) {
  const key = path.join('.');
  const renderer = useRenderer();
  const opened = renderer.opened[key];
  const label = path[path.length - 1];

  return (
    <span className="text-left mr-[7px] relative">
      {collapsible && !preview && (
        <div className="absolute left-[-10px] top-[-1px]">
          <Carret direction={opened ? 'down' : 'right'} />
        </div>
      )}
      <span
        className={classNames(
          preview
            ? 'text-console-object-gray'
            : 'text-console-object-blue font-bold',
          path.length === 0 && preview && 'italic',
        )}
      >
        {label}
      </span>
      <span className={classNames(preview && 'text-white')}>:</span>
    </span>
  );
}

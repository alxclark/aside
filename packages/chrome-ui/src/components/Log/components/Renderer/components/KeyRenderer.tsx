import React from 'react';
import classNames from 'classnames';

import {Carret} from '../../../../Carret';
import {useRenderer} from '../../../hooks';

export function KeyRenderer({
  path,
  collapsible = true,
  onPress,
  preview,
}: {
  path: string[];
  collapsible?: boolean;
  onPress?: () => void;
  preview?: boolean;
}) {
  const key = path[path.length - 1];
  const renderer = useRenderer();
  const opened = renderer.opened[key];

  return (
    <span
      className="text-left mr-[7px] relative"
      onKeyDown={onPress}
      onClick={onPress}
    >
      {collapsible && !preview && (
        <div className="absolute left-[-10px] top-[-2px]">
          <Carret direction={opened ? 'down' : 'right'} />
        </div>
      )}
      <span
        className={classNames(
          preview
            ? 'text-console-object-gray italic'
            : 'text-console-object-blue font-bold',
        )}
      >
        {key}
      </span>
      <span className={classNames(preview && 'text-white')}>:</span>
    </span>
  );
}

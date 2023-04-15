import classNames from 'classnames';
import React, {PropsWithChildren} from 'react';

import {Icon, IconSource} from '../Icon';

export type Props = PropsWithChildren<{
  onPress?: () => void;
  icon?: IconSource;
  pressed?: boolean;
  title?: string;
  iconHeight?: number;
  color?: string;
  alert?: boolean;
}>;

export function Button({
  children,
  onPress,
  icon,
  pressed,
  title,
  iconHeight = 13,
  color,
  alert,
}: Props) {
  if (icon) {
    return (
      <button
        title={title}
        aria-label={title}
        className={classNames(
          'w-[28px] h-[26px] flex items-center justify-center text-gray-300 hover:text-white cursor-default',
          pressed && 'text-lightblue',
          alert && 'text-lightred',
        )}
        onClick={() => onPress?.()}
      >
        <Icon source={icon} height={iconHeight} color={color} />
      </button>
    );
  }

  return (
    <button className="" onClick={onPress}>
      {children}
    </button>
  );
}

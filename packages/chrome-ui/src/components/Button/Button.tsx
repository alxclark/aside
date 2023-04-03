import classNames from 'classnames';
import React, {PropsWithChildren} from 'react';

import {Icon, IconSource} from '../Icon';

export type Props = PropsWithChildren<{
  onPress?: () => void;
  icon?: IconSource;
  pressed?: boolean;
  title?: string;
  iconHeight?: number;
}>;

export function Button({
  children,
  onPress,
  icon,
  pressed,
  title,
  iconHeight = 13,
}: Props) {
  if (icon) {
    return (
      <button
        title={title}
        aria-label={title}
        className={classNames(
          'w-[28px] h-[26px] flex items-center justify-center text-gray-300 hover:text-white',
          pressed && 'text-lightblue',
        )}
        onClick={onPress}
      >
        <Icon source={icon} height={iconHeight} />
      </button>
    );
  }

  return (
    <button className="" onClick={onPress}>
      {children}
    </button>
  );
}

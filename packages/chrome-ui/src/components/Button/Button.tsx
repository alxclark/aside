import classNames from 'classnames';
import React, {PropsWithChildren} from 'react';

import {Icon, IconSource} from '../Icon';
import {Carret} from '../Carret';

export type Props = PropsWithChildren<{
  onPress?: () => void;
  icon?: IconSource;
  pressed?: boolean;
  title?: string;
  iconHeight?: number;
  color?: string;
  alert?: boolean;
  disclosure?: boolean;
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
  disclosure,
}: Props) {
  if (icon) {
    return (
      <button
        title={title}
        aria-label={title}
        className={classNames(
          'w-[28px] h-[26px] flex items-center justify-center text-gray-300 cursor-default',
          pressed && 'text-lightblue',
          alert ? 'text-lightred' : 'hover:text-white',
        )}
        onClick={() => onPress?.()}
      >
        <Icon source={icon} height={iconHeight} color={color} />
      </button>
    );
  }

  return (
    <button
      className="px-1 flex gap-1 align-center items-center hover:text-white text-gray-300 relative"
      onClick={() => onPress?.()}
    >
      {children}
      {disclosure && <Carret direction="down" />}
    </button>
  );
}

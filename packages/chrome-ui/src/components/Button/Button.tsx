import React, {PropsWithChildren} from 'react';

import {Carret} from '../Carret';

export type Props = PropsWithChildren<{
  /**
   * Callback to execute when pressed.
   */
  onPress?: () => void;
  /**
   * Title for the underlying button. The title is shown in a popup when a user hovers the button.
   */
  title?: string;
  /**
   * A visual variation of the button.
   */
  variant?: 'icon';
  /**
   * Whether the button should show a disclosure icon.
   */
  disclosure?: boolean;
}>;

export function Button({children, onPress, title, variant, disclosure}: Props) {
  if (variant === 'icon') {
    return (
      <button
        title={title}
        aria-label={title}
        className="w-[28px] h-[26px] flex items-center justify-center text-gray-300 cursor-default"
        onClick={() => onPress?.()}
      >
        {children}
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

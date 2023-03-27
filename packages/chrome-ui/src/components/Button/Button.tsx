import React, {PropsWithChildren} from 'react';

export type Props = PropsWithChildren<{
  onPress?: () => void;
}>;

export function Button({children, onPress}: Props) {
  return (
    <button className="" onClick={onPress}>
      {children}
    </button>
  );
}

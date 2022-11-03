import React from 'react';
import type {PropsWithChildren} from 'react';

export function Button({
  children,
  onPress,
}: PropsWithChildren<{onPress?: () => void}>) {
  return <button onClick={() => onPress?.()}>{children}</button>;
}

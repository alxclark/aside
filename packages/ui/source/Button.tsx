import {ButtonProperties} from '@aside/remote';
import {PropsWithChildren} from 'react';

export interface ButtonProps extends PropsWithChildren<ButtonProperties> {}

export function Button({children, disabled}: ButtonProps) {
  return <button disabled={disabled}>{children}</button>;
}

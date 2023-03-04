import React, {PropsWithChildren} from 'react';

export type Props = PropsWithChildren<{}>;

export function Button({children}: Props) {
  return <button className="">{children}</button>;
}

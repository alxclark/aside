import React, {PropsWithChildren} from 'react';

export type Props = PropsWithChildren<{}>;

export function Pane({children}: Props) {
  return <div>{children}</div>;
}

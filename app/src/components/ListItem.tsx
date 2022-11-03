import React from 'react';
import type {PropsWithChildren} from 'react';

export function ListItem({children}: PropsWithChildren<{}>) {
  return <li>{children}</li>;
}

import React, {PropsWithChildren} from 'react';

export function Button({children}: PropsWithChildren<{}>) {
  return <button className="">{children}</button>;
}

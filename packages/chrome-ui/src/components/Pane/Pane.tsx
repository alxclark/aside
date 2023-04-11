import React, {PropsWithChildren} from 'react';

import {Flex} from '../Flex';

export type Props = PropsWithChildren<{}>;

export function Pane({children}: Props) {
  return (
    <Flex fullHeight direction="column">
      {children}
    </Flex>
  );
}

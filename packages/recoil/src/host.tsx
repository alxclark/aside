import React, {PropsWithChildren} from 'react';
import {Aside, DevTools as AsideDevTools} from '@aside/react';
import {RecoilRoot, useRecoilSnapshot} from 'recoil';

import {RemoteDevTools} from './remote';

export function DevTools({children}: PropsWithChildren<{}>) {
  const recoilSnapshot = useRecoilSnapshot();

  return (
    <Aside>
      <AsideDevTools>
        <RecoilRoot key="@aside/recoil">
          <RemoteDevTools snapshot={recoilSnapshot} />
        </RecoilRoot>
        {children}
      </AsideDevTools>
    </Aside>
  );
}

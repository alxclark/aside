import React from 'react';
import {RecoilRoot} from 'recoil';

import {DevToolsApi} from './types';
import {PrimaryPanel} from './components';

export function RemoteDevTools({api}: {api: DevToolsApi}) {
  return (
    <RecoilRoot key="@companion/recoil">
      <PrimaryPanel api={api} />
    </RecoilRoot>
  );
}

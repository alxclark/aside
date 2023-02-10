import React from 'react';
import {Navigation, NavigationTab} from '@companion/react';
import {useRecoilState} from 'recoil';

import {DevToolsApi} from '../../types';
import {PrimaryNavigationTab} from '../../foundation/Navigation';
import {StateTree} from '../StateTree';
import {StateDiffs} from '../StateDiffs';
// eslint-disable-next-line @shopify/strict-component-boundaries
import {primaryNavigationAtom} from '../../foundation/Navigation/atoms';

export function PrimaryPanel({api}: {api: DevToolsApi}) {
  const [primaryNavigation, setPrimaryNavigation] = useRecoilState(
    primaryNavigationAtom,
  );

  return (
    <>
      <Navigation
        selected={primaryNavigation.tab}
        navigate={(value) => {
          setPrimaryNavigation({tab: value as PrimaryNavigationTab});
        }}
      >
        <NavigationTab
          value={PrimaryNavigationTab.StateTree}
          label="State tree"
        />
        {/* <NavigationTab
          value={PrimaryNavigationTab.StateDiffs}
          label="State diffs"
        /> */}
      </Navigation>
      {primaryNavigation.tab === PrimaryNavigationTab.StateTree && (
        <StateTree currentState={api.snapshots[api.snapshots.length - 1]} />
      )}
      {primaryNavigation.tab === PrimaryNavigationTab.StateDiffs && (
        <StateDiffs diffs={api.diffs} />
      )}
    </>
  );
}

import React from 'react';
import {Navigation, NavigationTab} from '@companion/react';
import {useRecoilState} from 'recoil';

import {DevToolsApi} from '../../types';
import {
  primaryNavigationAtom,
  PrimaryNavigationTab,
} from '../../foundation/Navigation';
import {StateTree} from '../StateTree';
import {StateDiffs} from '../StateDiffs';

export function PrimaryPanel({api}: {api: DevToolsApi}) {
  const [primaryNavigation, setPrimaryNavigation] = useRecoilState(
    primaryNavigationAtom,
  );

  return (
    <Navigation
      selected={primaryNavigation.tab}
      navigate={(value) =>
        setPrimaryNavigation({tab: value as PrimaryNavigationTab})
      }
    >
      <NavigationTab
        value={PrimaryNavigationTab.StateTree}
        label="State tree"
      />
      <NavigationTab
        value={PrimaryNavigationTab.StateDiffs}
        label="State diffs"
      />

      {primaryNavigation.tab === PrimaryNavigationTab.StateTree && (
        <StateTree currentState={api.snapshots[api.snapshots.length - 1]} />
      )}
      {primaryNavigation.tab === PrimaryNavigationTab.StateDiffs && (
        <StateDiffs diffs={api.diffs} />
      )}
    </Navigation>
  );
}

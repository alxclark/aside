import React from 'react';
import {Flex, Navigation, NavigationTab, View} from '@aside/react';
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
    <Flex direction="column" fullHeight>
      <Navigation
        selected={primaryNavigation.tab}
        navigate={(value) => {
          setPrimaryNavigation({tab: value as PrimaryNavigationTab});
        }}
      >
        <NavigationTab value={PrimaryNavigationTab.StateTree} label="State" />
        <NavigationTab
          value={PrimaryNavigationTab.StateDiffs}
          label="Timeline"
        />
      </Navigation>
      <View flexGrow>
        {primaryNavigation.tab === PrimaryNavigationTab.StateTree && (
          <StateTree currentState={api.snapshots[api.snapshots.length - 1]} />
        )}
        {primaryNavigation.tab === PrimaryNavigationTab.StateDiffs && (
          <StateDiffs diffs={api.diffs} initial={api.snapshots[0]} />
        )}
      </View>
    </Flex>
  );
}

import React from 'react';
import {Flex, Pane, PaneToolbar, Tab, Tabs} from '@aside/chrome-ui';
import {useRecoilState} from 'recoil';

import {PrimaryNavigationTab} from '../../foundation/Navigation';
import {StateTree} from '../StateTree';
import {StateDiffs} from '../StateDiffs';
// eslint-disable-next-line @shopify/strict-component-boundaries
import {primaryNavigationAtom} from '../../foundation/Navigation/atoms';

export function PrimaryPanel() {
  const [primaryNavigation, setPrimaryNavigation] = useRecoilState(
    primaryNavigationAtom,
  );

  return (
    <Pane>
      <PaneToolbar>
        <Flex justifyContent="space-between">
          <Flex alignItems="center">
            <Tabs
              selected={primaryNavigation.tab}
              setSelected={(value) => {
                setPrimaryNavigation({tab: value as PrimaryNavigationTab});
              }}
            >
              <Tab id={PrimaryNavigationTab.StateTree} label="State" />
              <Tab id={PrimaryNavigationTab.StateDiffs} label="Timeline" />
            </Tabs>
          </Flex>
        </Flex>
      </PaneToolbar>

      {primaryNavigation.tab === PrimaryNavigationTab.StateTree && (
        <StateTree />
      )}
      {primaryNavigation.tab === PrimaryNavigationTab.StateDiffs && (
        <StateDiffs />
      )}
    </Pane>
  );
}

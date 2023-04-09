/* eslint-disable import/no-anonymous-default-export */
import React from 'react';

import {Checkbox} from '../Checkbox';
import {Button} from '../Button';
import {Tab, Tabs} from '../Tabs';
import {Flex} from '../Flex';
import {Divider} from '../Divider';
import {TextField} from '../TextField';
import {View} from '../View';

import {PaneToolbar, PaneToolbarSection} from './components';
import {Pane} from './Pane';

export default {
  title: 'ChromeUI/Pane',
  component: Pane,
};

const Template = (args: any) => <Pane {...args} />;

const Children = () => {
  return (
    <>
      <PaneToolbar>
        <Flex justifyContent="space-between">
          <Flex alignItems="center">
            <Button icon="vertical-ellipsis" title="More tools" />
            <Tabs selected="network" setSelected={console.log}>
              <Tab id="console" label="Console" />
              <Tab id="network" label="Network" />
            </Tabs>
          </Flex>
          <Button icon="close" iconHeight={10} title="Close drawer" />
        </Flex>
      </PaneToolbar>
      <PaneToolbar>
        <Flex justifyContent="space-between" alignItems="start">
          <Flex alignItems="center" wrap>
            <PaneToolbarSection>
              <Button
                icon="record-on"
                color="rgb(242, 139, 130)"
                title="Stop recording"
                iconHeight={19}
              />
              <Button icon="cancel" title="Clear" />
            </PaneToolbarSection>
            <PaneToolbarSection>
              <Button icon="filter" iconHeight={12} pressed title="Filter" />
              <Button icon="search" title="Search" iconHeight={20} />
            </PaneToolbarSection>
            <PaneToolbarSection>
              <Checkbox
                id="log"
                label="Preserve log"
                checked
                onChange={console.log}
              />
            </PaneToolbarSection>
            <Checkbox
              id="caching"
              label="Disable caching"
              onChange={console.log}
            />
          </Flex>
          <PaneToolbarSection separatorBefore>
            <Button icon="cog" iconHeight={14} />
          </PaneToolbarSection>
        </Flex>
      </PaneToolbar>
      <PaneToolbar>
        <Flex alignItems="center" gap="4px">
          <View padding="3px 4px">
            <TextField placeholder="Filter" id="filter" />
          </View>
          <Flex wrap gap="7px">
            <Checkbox id="invert" label="Invert" onChange={console.log} />
            <Checkbox
              id="data-urls"
              label="Hide data URLs"
              onChange={console.log}
            />
          </Flex>
        </Flex>
      </PaneToolbar>
    </>
  );
};

export const WithAllItsElements = Template.bind({}) as any;
// More on args: https://storybook.js.org/docs/react/writing-stories/args
WithAllItsElements.args = {
  children: <Children />,
};

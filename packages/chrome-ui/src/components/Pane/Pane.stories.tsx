/* eslint-disable import/no-anonymous-default-export */
import React from 'react';

import {Checkbox} from '../Checkbox';
import {Button} from '../Button';
import {Icon} from '../Icon';
import {Tab, Tabs} from '../Tabs';
import {Flex} from '../Flex';
import {Divider} from '../Divider';

import {PaneHeader} from './components';
import {Pane} from './Pane';

export default {
  title: 'ChromeUI/Pane',
  component: Pane,
};

const Template = (args: any) => <Pane {...args} />;

const Children = () => {
  return (
    <>
      <PaneHeader>
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
      </PaneHeader>
      <PaneHeader>
        <Flex justifyContent="space-between" alignItems="start">
          <Flex alignItems="center" wrap>
            <Button icon="cancel" title="Clear" />
            <Button icon="cancel" />
            <Divider />
            <Button icon="filter" iconHeight={12} pressed title="Filter" />
            <Button icon="filter" title="Search" />
            <Divider />
            <Checkbox
              id="log"
              label="Preserve log"
              checked
              onChange={console.log}
            />
            <Divider />
            <Checkbox
              id="caching"
              label="Disable caching"
              onChange={console.log}
            />
            <Icon source="filter" height={12} color="#919191" />
            <Divider />
            <Icon source="filter" height={12} color="#919191" />
            <Icon source="filter" height={12} color="#919191" />
          </Flex>
          <Flex alignItems="center">
            <Divider />
            <Icon source="cog" height={14} color="#919191" />
          </Flex>
        </Flex>
      </PaneHeader>
    </>
  );
};

export const WithAllItsElements = Template.bind({}) as any;
// More on args: https://storybook.js.org/docs/react/writing-stories/args
WithAllItsElements.args = {
  children: <Children />,
};

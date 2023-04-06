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
            <Button
              icon="record-on"
              color="rgb(242, 139, 130)"
              title="Stop recording"
              iconHeight={19}
            />
            <Button icon="cancel" title="Clear" />
            <Divider />
            <Button icon="filter" iconHeight={12} pressed title="Filter" />
            <Button icon="search" title="Search" iconHeight={20} />
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
          </Flex>
          <Flex alignItems="center">
            <Divider />
            <Button icon="cog" iconHeight={14} />
          </Flex>
        </Flex>
      </PaneHeader>
      <PaneHeader>hey</PaneHeader>
    </>
  );
};

export const WithAllItsElements = Template.bind({}) as any;
// More on args: https://storybook.js.org/docs/react/writing-stories/args
WithAllItsElements.args = {
  children: <Children />,
};

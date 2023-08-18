/* eslint-disable import/no-anonymous-default-export */
import React from 'react';

import {Tabs, TabsList, TabsTrigger} from '../../../Tabs';

import {PaneToolbar} from './PaneToolbar';

export default {
  title: 'ChromeUI/Pane/Header',
  component: PaneToolbar,
};

const Template = (args: any) => <PaneToolbar {...args} />;

const Children = () => {
  return (
    <Tabs defaultValue="messages">
      <TabsList>
        <TabsTrigger value="state">State</TabsTrigger>
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
        <TabsTrigger value="messages">Messages</TabsTrigger>
        <TabsTrigger value="options">Options</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export const Default = Template.bind({}) as any;
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  children: <Children />,
};

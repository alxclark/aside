/* eslint-disable import/no-anonymous-default-export */
import React from 'react';

import {Tabs, TabsList, TabsTrigger} from './Tabs';

export default {
  title: 'ChromeUI/Tabs',
  component: Tabs,
};

const Template = (args: any) => <Tabs {...args} defaultValue="messages" />;

const Children = () => {
  return (
    <TabsList>
      <TabsTrigger value="state">State</TabsTrigger>
      <TabsTrigger value="timeline">Timeline</TabsTrigger>
      <TabsTrigger value="messages">Messages</TabsTrigger>
      <TabsTrigger value="options">Options</TabsTrigger>
    </TabsList>
  );
};

export const Default = Template.bind({}) as any;
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  children: <Children />,
};

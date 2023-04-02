/* eslint-disable import/no-anonymous-default-export */
import React from 'react';

import {Tabs, Tab} from './Tabs';

export default {
  title: 'ChromeUI/Tabs',
  component: Tabs,
};

const Template = (args: any) => (
  <Tabs {...args} selected="messages" setSelected={console.log} />
);

const Children = () => {
  return (
    <>
      <Tab id="state" label="State" />
      <Tab id="timeline" label="Timeline" />
      <Tab id="messages" label="Messages" />
      <Tab id="options" label="Options" />
    </>
  );
};

export const Default = Template.bind({}) as any;
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  children: <Children />,
};

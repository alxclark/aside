/* eslint-disable import/no-anonymous-default-export */
import React from 'react';

import {Tabs, Tab} from '../../../Tabs';

import {PaneHeader} from './PaneHeader';

export default {
  title: 'ChromeUI/Pane/Header',
  component: PaneHeader,
};

const Template = (args: any) => <PaneHeader {...args} />;

const Children = () => {
  return (
    <Tabs selected="messages" setSelected={console.log}>
      <Tab id="state" label="State" />
      <Tab id="timeline" label="Timeline" />
      <Tab id="messages" label="Messages" />
      <Tab id="options" label="Options" />
    </Tabs>
  );
};

export const Default = Template.bind({}) as any;
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  children: <Children />,
};

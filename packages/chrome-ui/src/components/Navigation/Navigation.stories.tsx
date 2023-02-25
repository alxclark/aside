/* eslint-disable import/no-anonymous-default-export */
import React from 'react';

import {NavigationTab} from './components';
import {Navigation} from './Navigation';

import '../../../dist/styles.css';

export default {
  title: 'ChromeUI/Navigation',
  component: Navigation,
};

const Template = (args: any) => <Navigation {...args} />;

const Children = () => {
  return (
    <>
      <NavigationTab value="state" label="State" />
      <NavigationTab value="timeline" label="Timeline" />
      <NavigationTab value="messages" label="Messages" />
      <NavigationTab value="options" label="Options" />
    </>
  );
};

export const Default = Template.bind({}) as any;
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  children: <Children />,
};

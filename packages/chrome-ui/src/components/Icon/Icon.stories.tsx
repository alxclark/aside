/* eslint-disable import/no-anonymous-default-export */
import React from 'react';

import {Icon, Props} from './Icon';

import '../../../dist/styles.css';

export default {
  title: 'ChromeUI/Icon',
  component: Icon,
};

const Template = (args: any) => <Icon {...args} />;

export const Curly = Template.bind({}) as any;
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Curly.args = {
  source: 'curly',
  height: 18,
  color: '#e5ab04',
} as Props;
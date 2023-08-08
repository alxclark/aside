/* eslint-disable import/no-anonymous-default-export */
import React from 'react';

import {Icon, Props} from './Icon';

import '../../../build/css/styles.css';

export default {
  title: 'ChromeUI/Icon',
  component: Icon,
};

const Template = (args: any) => <Icon {...args} />;

export const Filter = Template.bind({}) as any;
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Filter.args = {
  source: 'filter',
  color: 'icon-default',
} as Props;

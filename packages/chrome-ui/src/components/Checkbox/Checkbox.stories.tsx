/* eslint-disable import/no-anonymous-default-export */
import React from 'react';

import {Checkbox, Props} from './Checkbox';

import '../../../build/css/styles.css';

export default {
  title: 'ChromeUI/Checkbox',
  component: Checkbox,
};

const Template = (args: any) => <Checkbox {...args} />;

export const Checked = Template.bind({}) as any;
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Checked.args = {
  checked: true,
  id: 'preserve-log',
  label: 'Preserve log',
  onChange: console.log,
} as Props;

export const Unchecked = Template.bind({}) as any;
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Unchecked.args = {
  checked: false,
  id: 'preserve-log',
  label: 'Preserve log',
  onChange: console.log,
} as Props;

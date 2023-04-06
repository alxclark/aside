/* eslint-disable import/no-anonymous-default-export */
import React from 'react';

import {TextField, Props} from './TextField';

import '../../../build/css/styles.css';

export default {
  title: 'ChromeUI/TextField',
  component: TextField,
};

const Template = (args: any) => <TextField {...args} />;

export const Default = Template.bind({}) as any;
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  id: 'filter',
  placeholder: 'Filter',
  onChange: console.log,
} as Props;

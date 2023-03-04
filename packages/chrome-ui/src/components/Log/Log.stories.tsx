/* eslint-disable import/no-anonymous-default-export */
import React from 'react';

import {Log, Props} from './Log';

import '../../../build/css/styles.css';

export default {
  title: 'ChromeUI/Log',
  component: Log,
};

const Template = (args: any) => <Log {...args} />;

export const Default = Template.bind({}) as any;
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  items: [{id: 'first', value: {something: {1: 'hey'}, else: 5}}],
} as Props;

/* eslint-disable import/no-anonymous-default-export */
import React from 'react';

import {Log, Props} from './Log';
import {DiffNode} from './types';

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

export const Diff = Template.bind({}) as any;

Diff.args = {
  items: [
    {
      id: 'diff',
      value: {
        // number: 5,
        // numberToString: {
        //   __tag: 'diff',
        //   next: '5',
        //   previous: 5,
        // },
        // boolean: {
        //   __tag: 'diff',
        //   next: true,
        //   previous: false,
        // },
        // undefined: {
        //   __tag: 'diff',
        //   next: undefined,
        //   previous: null,
        // },
        array: [1, 2, 3, 4],
        // arrayChange: {
        //   __tag: 'diff',
        //   next: [1, 2, 3, 4],
        //   previous: [1, 2, 3],
        // },
        // object: {
        //   __tag: 'diff',
        //   next: {hey: 3},
        //   previous: {yo: 5},
        // },
      },
    },
  ],
  showDiffs: true,
} as Props;

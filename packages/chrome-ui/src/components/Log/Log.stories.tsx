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

export const ArrayDiff = Template.bind({}) as any;

ArrayDiff.args = {
  items: [
    {
      id: 'diff',
      value: {
        arrayChange: {
          __tag: 'diff',
          next: [1, 2, 3, 4],
          previous: [1, 2, 3],
        },
        arrayChange2: {
          __tag: 'diff',
          next: [1, 2, 3, 4],
          previous: undefined,
        },
        arrayChange3: {
          __tag: 'diff',
          next: null,
          previous: [1, 2, 3, 4],
        },
      },
    },
  ],
  showDiffs: true,
} as Props;

export const ObjectDiff = Template.bind({}) as any;

ObjectDiff.args = {
  items: [
    {
      id: 'diff',
      value: {
        sameKeysAndValues: {
          __tag: 'diff',
          next: {count: 1},
          previous: {count: 1},
        },
        sameKeys: {
          __tag: 'diff',
          next: {count: 1},
          previous: {count: 0},
        },
        differentKeys: {
          __tag: 'diff',
          next: {count: 0},
          previous: {sum: 100},
        },
      },
    },
  ],
  showDiffs: true,
} as Props;

export const ArrayOfNumbers = Template.bind({}) as any;

ArrayOfNumbers.args = {
  items: [
    {
      id: 'numbers',
      value: {
        numbers: [1, 2, 3, 4],
      },
    },
  ],
} as Props;

export const ArrayOfObjects = Template.bind({}) as any;

ArrayOfObjects.args = {
  items: [
    {
      id: 'objects',
      value: {
        objects: [{apple: true}, {banana: true}, {pear: true}, {kiwi: true}],
      },
    },
  ],
} as Props;

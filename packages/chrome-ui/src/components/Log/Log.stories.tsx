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

export const PrimitiveDiff = Template.bind({}) as any;

PrimitiveDiff.args = {
  items: [
    {
      id: 'diff',
      value: {
        numberChange: {
          __tag: 'diff',
          next: 10,
          previous: 0,
        },
        booleanChange: {
          __tag: 'diff',
          next: false,
          previous: true,
        },
        booleanChange2: {
          __tag: 'diff',
          next: true,
          previous: false,
        },
        stringChange: {
          __tag: 'diff',
          next: 'test@email.com',
          previous: '',
        },
      },
    },
  ],
  showDiffs: true,
} as Props;

export const ArrayDiff = Template.bind({}) as any;

ArrayDiff.args = {
  items: [
    {
      id: 'diff',
      value: {
        oneMore: {
          __tag: 'diff',
          next: [1, 2, 3, 4],
          previous: [1, 2, 3],
        },
        oneLess: {
          __tag: 'diff',
          previous: [1, 2, 3, 4],
          next: [1, 2, 3],
        },
        undefinedToArray: {
          __tag: 'diff',
          next: [1, 2, 3, 4],
          previous: undefined,
        },
        arrayToNull: {
          __tag: 'diff',
          next: null,
          previous: [1, 2, 3, 4],
        },
        arrayObject: {
          __tag: 'diff',
          next: [{apple: true}, {banana: true}],
          previous: [{apple: true}],
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
        nested: {
          __tag: 'diff',
          next: {car: {brand: 'VW', cost: 10000}},
          previous: {wallet: {amount: 10000}},
        },
      },
    },
  ],
  showDiffs: true,
} as Props;

export const NestedDiff = Template.bind({}) as any;

NestedDiff.args = {
  items: [
    {
      id: 'diff',
      value: {
        newTodo: [
          {
            id: 1,
            description: 'Clean the dishes.',
          },
          {
            __tag: 'diff',
            next: {id: 2, description: 'Feed the cats'},
            previous: undefined,
          },
        ],
        removedTodo: [
          {
            __tag: 'diff',
            next: {id: 2, description: 'Feed the cats'},
            previous: {id: 1, description: 'Clean the dishes'},
          },
          {
            __tag: 'diff',
            next: {id: 3, description: 'Vaccum the apartment'},
            previous: {id: 2, description: 'Feed the cats'},
          },
        ],
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

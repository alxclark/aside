/* eslint-disable import/no-anonymous-default-export */
import React from 'react';

import {ConsoleMessage, Props} from './ConsoleMessage';

import '../../../build/css/styles.css';

export default {
  title: 'ChromeUI/ConsoleMessage',
  component: ConsoleMessage,
};

const Template = (args: any) => <ConsoleMessage {...args} />;

export const Default = Template.bind({}) as any;
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  value: {something: {1: 'hey'}, else: 5},
} as Props;

export const PrimitiveDiff = Template.bind({}) as any;

PrimitiveDiff.args = {
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
  showPreviousValues: true,
} as Props;

export const ArrayDiff = Template.bind({}) as any;
const object = {apple: true};
ArrayDiff.args = {
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
      next: [object, {banana: true}],
      previous: [object],
    },
  },
  showPreviousValues: true,
} as Props;

export const ObjectDiff = Template.bind({}) as any;

ObjectDiff.args = {
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
  showPreviousValues: true,
} as Props;

export const NestedDiff = Template.bind({}) as any;

NestedDiff.args = {
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
  showPreviousValues: true,
} as Props;

export const ArrayOfNumbers = Template.bind({}) as any;

ArrayOfNumbers.args = {
  value: {
    numbers: [1, 2, 3, 4],
  },
} as Props;

export const ArrayOfObjects = Template.bind({}) as any;

ArrayOfObjects.args = {
  value: {
    objects: [{apple: true}, {banana: true}, {pear: true}, {kiwi: true}],
  },
} as Props;

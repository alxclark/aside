/* eslint-disable @typescript-eslint/naming-convention */
import {createDiff} from '../diff';

describe('diff', () => {
  describe('objects', () => {
    it('returns an empty object when there are no changes', () => {
      const diff = createDiff({
        previous: {one: 1, two: 2},
        next: {one: 1, two: 2},
      });

      expect(diff).toEqual({});
    });

    it('returns existing keys that changed value', () => {
      const diff = createDiff({
        previous: {
          string: 'hi',
          number: 7,
          boolean: false,
          unchanged: 'wow',
        },
        next: {string: 'bye', number: 98, boolean: true, unchanged: 'wow'},
      });

      expect(diff).toEqual({
        string: {
          __tag: 'diff',
          previous: 'hi',
          next: 'bye',
        },
        number: {
          __tag: 'diff',
          previous: 7,
          next: 98,
        },
        boolean: {
          __tag: 'diff',
          previous: false,
          next: true,
        },
      });
    });

    it('returns `undefined` when a key is removed', () => {
      const diff = createDiff({
        previous: {one: 1, two: 2},
        next: {two: 2},
      });

      expect(diff).toEqual({
        one: {
          __tag: 'diff',
          next: undefined,
          previous: 1,
        },
      });
    });

    it('returns `undefined` when a key is added', () => {
      const diff = createDiff({
        previous: {one: 1, two: 2},
        next: {one: 1, two: 2, three: 3},
      });

      expect(diff).toEqual({
        three: {
          __tag: 'diff',
          next: 3,
          previous: undefined,
        },
      });
    });
  });

  describe('arrays', () => {
    it('returns an empty object when there are no changes', () => {
      const diff = createDiff({
        previous: [1, 2, 3],
        next: [1, 2, 3],
      });

      expect(diff).toEqual({});
    });

    it('returns diff nodes for each array positions of new items in the array', () => {
      const diff = createDiff({
        previous: [1],
        next: [1, 2, 3],
      });

      expect(diff).toEqual({
        1: {
          __tag: 'diff',
          next: 2,
          previous: undefined,
        },
        2: {
          __tag: 'diff',
          next: 3,
          previous: undefined,
        },
      });
    });

    it('returns diff nodes for each array position of changed items in the array', () => {
      const diff = createDiff({
        previous: [1, 'hi', true, 0],
        next: [2, 'bye', false, 0],
      });

      expect(diff).toEqual({
        0: {
          __tag: 'diff',
          previous: 1,
          next: 2,
        },
        1: {
          __tag: 'diff',
          previous: 'hi',
          next: 'bye',
        },
        2: {
          __tag: 'diff',
          previous: true,
          next: false,
        },
      });
    });

    it('returns diff nodes for each array position of changed items in the array', () => {
      const diff = createDiff({
        previous: [1, 2, 3],
        next: [1, 2],
      });

      // todo: removed item should be captured differently.
      // currently removed item will be shown as undefined
      // but we actually want to remove the item completely
      expect(diff).toEqual({
        2: {
          __tag: 'diff',
          next: undefined,
          previous: 3,
        },
      });
    });

    describe('arrays in objects', () => {
      it('returns diff nodes for each array position of changed items in the array', () => {
        const diff = createDiff({
          previous: {
            array: ['hi', 'bye', 'wow'],
          },
          next: {
            array: ['hi', 'bye', 'wowwow', 'cool'],
          },
        });

        // todo: removed item should be captured differently.
        // currently removed item will be shown as undefined
        // but we actually want to remove the item completely
        expect(diff).toEqual({
          array: {
            2: {
              __tag: 'diff',
              next: 'wowwow',
              previous: 'wow',
            },
            3: {
              __tag: 'diff',
              next: 'cool',
              previous: undefined,
            },
          },
        });
      });
    });
  });
});

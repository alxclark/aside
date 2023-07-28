/* eslint-disable @typescript-eslint/naming-convention */
import {createDiff} from '../utilities';

describe('Snapshots utilities', () => {
  describe('createDiff', () => {
    describe('when the previous object is empty', () => {
      it('returns a diff node for all field of the next object', () => {
        const diff = createDiff({previous: {}, next: {count: 0}});

        expect(diff).toStrictEqual({
          count: {
            __tag: 'diff',
            next: 0,
            previous: undefined,
          },
        });
      });
    });

    describe('when a field was removed from the previous object', () => {
      it('returns a diff node for all field of the next object', () => {
        const diff = createDiff({
          previous: {
            count: 0,
            sum: 10,
          },
          next: {count: 0},
        });

        expect(diff).toStrictEqual({
          sum: {
            __tag: 'diff',
            next: undefined,
            previous: 10,
          },
        });
      });
    });

    describe('when a field is added in the next object', () => {
      it('returns a diff node for all field of the next object', () => {
        const diff = createDiff({
          previous: {
            count: 0,
          },
          next: {count: 0, sum: 10},
        });

        expect(diff).toStrictEqual({
          sum: {
            __tag: 'diff',
            next: 10,
            previous: undefined,
          },
        });
      });
    });

    describe('string', () => {
      describe('when a value changed', () => {
        it('returns a diff node with the previous and next values', () => {
          const diff = createDiff({
            previous: {
              string: 'hello',
            },
            next: {string: 'byebye'},
          });

          expect(diff).toStrictEqual({
            string: {
              __tag: 'diff',
              next: 'byebye',
              previous: 'hello',
            },
          });
        });
      });

      describe('when a value stayed the same', () => {
        it('does not return a diff node', () => {
          const diff = createDiff({
            previous: {
              string: 'hello',
            },
            next: {string: 'hello'},
          });

          expect(diff).toStrictEqual({});
        });
      });

      describe('nested object', () => {
        it('does not return a diff node', () => {
          const diff = createDiff({
            previous: {
              nested: {
                string: 'hello',
              },
            },
            next: {nested: {string: 'hello'}},
          });

          expect(diff).toStrictEqual({});
        });
      });

      describe('nested array', () => {
        it('does not return a diff node when value is the same', () => {
          const diff = createDiff({
            previous: {
              nested: ['hello'],
            },
            next: {nested: ['hello']},
          });

          expect(diff).toStrictEqual({});
        });

        it('returns a diff node when value changed', () => {
          const diff = createDiff({
            previous: {
              nested: ['hello'],
            },
            next: {nested: ['byebye']},
          });

          expect(diff).toStrictEqual({
            nested: {
              0: {
                __tag: 'diff',
                previous: 'hello',
                next: 'byebye',
              },
            },
          });
        });
      });
    });

    describe('number', () => {
      describe('when a value changed', () => {
        it('returns a diff node with the previous and next values', () => {
          const diff = createDiff({
            previous: {
              count: 0,
            },
            next: {count: 1},
          });

          expect(diff).toStrictEqual({
            count: {
              __tag: 'diff',
              next: 1,
              previous: 0,
            },
          });
        });
      });

      describe('when a value stayed the same', () => {
        it('does not return a diff node', () => {
          const diff = createDiff({
            previous: {
              count: 5,
            },
            next: {count: 5},
          });

          expect(diff).toStrictEqual({});
        });
      });
    });

    describe('nested object', () => {
      describe('when a value changed', () => {
        it('returns a nested diff node for the updated value', () => {
          const diff = createDiff({
            previous: {
              nested: {
                count: 0,
                sum: 10,
              },
            },
            next: {
              nested: {
                count: 1,
                sum: 10,
              },
            },
          });

          expect(diff).toStrictEqual({
            nested: {
              count: {
                __tag: 'diff',
                next: 1,
                previous: 0,
              },
            },
          });
        });

        it('handles deeply nested objects', () => {
          const diff = createDiff({
            previous: {
              nested: {
                count: 0,
                sum: 10,
                moreNested: {
                  evenMoreNested: {
                    result: 0,
                    unchanged: 5,
                  },
                },
              },
            },
            next: {
              nested: {
                count: 1,
                sum: 10,
                moreNested: {
                  evenMoreNested: {
                    result: 10,
                    unchanged: 5,
                  },
                },
              },
            },
          });

          expect(diff).toStrictEqual({
            nested: {
              count: {
                __tag: 'diff',
                next: 1,
                previous: 0,
              },
              moreNested: {
                evenMoreNested: {
                  result: {
                    __tag: 'diff',
                    next: 10,
                    previous: 0,
                  },
                },
              },
            },
          });
        });
      });

      describe('when a value stayed the same', () => {
        it('does not return a diff node', () => {
          const diff = createDiff({
            previous: {
              count: 5,
            },
            next: {count: 5},
          });

          expect(diff).toStrictEqual({});
        });
      });
    });

    describe('arrays', () => {
      describe('when the array contains primitive values', () => {
        describe('when adding a new element at the end of the array', () => {
          it('returns a diff node for item at the given array index', () => {
            const diff = createDiff({
              previous: {
                array: [1, 2, 3],
              },
              next: {
                array: [1, 2, 3, 4],
              },
            });

            expect(diff).toStrictEqual({
              array: {
                3: {
                  __tag: 'diff',
                  previous: undefined,
                  next: 4,
                },
              },
            });
          });
        });

        describe('when adding a new element at the start of an array', () => {
          it('returns a diff node for each item affected by the change of index', () => {
            const diff = createDiff({
              previous: {
                array: [1, 2, 3],
              },
              next: {
                array: [0, 1, 2, 3],
              },
            });

            expect(diff).toStrictEqual({
              array: {
                0: {
                  __tag: 'diff',
                  previous: 1,
                  next: 0,
                },
                1: {
                  __tag: 'diff',
                  previous: 2,
                  next: 1,
                },
                2: {
                  __tag: 'diff',
                  previous: 3,
                  next: 2,
                },
                3: {
                  __tag: 'diff',
                  previous: undefined,
                  next: 3,
                },
              },
            });
          });
        });

        describe('when updating a specific element in the array', () => {
          it('returns a diff node for only the item affected by the change', () => {
            const diff = createDiff({
              previous: {
                array: [1, 2, 3],
              },
              next: {
                array: [1, 0, 3],
              },
            });

            expect(diff).toStrictEqual({
              array: {
                1: {
                  __tag: 'diff',
                  previous: 2,
                  next: 0,
                },
              },
            });
          });
        });
      });

      describe('when the array contains complex values', () => {
        it('returns a diff node for each index of the array that changed', () => {
          const diff = createDiff({
            previous: {
              array: [
                {
                  firstName: 'Mochi',
                },
                {
                  firstName: 'Alex',
                  lastName: 'Clark',
                },
              ],
            },
            next: {
              array: [
                {
                  firstName: 'Mochi',
                },
                {
                  firstName: 'Alexandre',
                  lastName: 'Clark',
                },
              ],
            },
          });

          expect(diff).toStrictEqual({
            array: {
              1: {
                firstName: {
                  __tag: 'diff',
                  previous: 'Alex',
                  next: 'Alexandre',
                },
              },
            },
          });
        });
      });
    });
  });
});

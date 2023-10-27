import React from 'react';
import {
  mount,
  createMockStatefulRemoteSubscribable,
} from '@aside/react/testing';

import {ActivityProvider} from '../ActivityProvider';
import {ActivityStoreContext} from '../../contexts';
import {
  createActivityStoreDescriptor,
  createSnapshot,
} from '../../testing/mocks';

describe('ActivityProvider', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('provides the activity store context', async () => {
    const provider = await mount(<ActivityProvider activity={[]} />);

    expect(provider).toProvideReactContext(ActivityStoreContext, []);
  });

  describe('when an activity store is provided', () => {
    it('provided an enhanced version of each store descriptors provided', async () => {
      const store = createActivityStoreDescriptor({
        icon: 'https://graphql.org/img/logo.svg',
        displayName: 'GraphQL',
        rowName: () => 'request',
        type: 'graphql',
        monitor: {
          snapshot: {
            id: '23',
            createdAt: Date.now().toString(),
            nodes: {
              SomeQuery: null,
            },
          },
        },
      });

      const provider = await mount(<ActivityProvider activity={[store]} />);

      expect(provider).toProvideReactContext(ActivityStoreContext, [
        {
          data: {
            displayName: store.displayName,
            icon: store.icon,
            type: store.type,
            rows: expect.anything(),
            name: expect.anything(),
            query: expect.anything(),
            onDelete: expect.anything(),
          },
          monitor: store.monitor,
        },
      ]);
    });

    describe('activates each store', () => {
      it('sets the store recording state to false when the global recording state is false', async () => {
        const mockSetRecordSnapshot = vi.fn();
        const recordSnapshot = false;

        const store = createActivityStoreDescriptor({
          monitor: {
            setRecordSnapshot: mockSetRecordSnapshot,
          },
        });

        await mount(<ActivityProvider activity={[store]} />, {
          extensionApi: {
            activity: {
              recordSnapshot: [
                createMockStatefulRemoteSubscribable(recordSnapshot),
                vi.fn(),
              ],
            },
          },
        });

        expect(mockSetRecordSnapshot).toHaveBeenCalledWith(recordSnapshot);
      });

      it('sets the store recording state to true when the global recording state is true', async () => {
        const mockSetRecordSnapshot = vi.fn();
        const recordSnapshot = true;

        const store = createActivityStoreDescriptor({
          monitor: {
            setRecordSnapshot: mockSetRecordSnapshot,
          },
        });

        await mount(<ActivityProvider activity={[store]} />, {
          extensionApi: {
            activity: {
              recordSnapshot: [
                createMockStatefulRemoteSubscribable(recordSnapshot),
                vi.fn(),
              ],
            },
          },
        });

        expect(mockSetRecordSnapshot).toHaveBeenCalledWith(recordSnapshot);
      });
    });

    describe('when there is persisted snapshots in the extension local storage', () => {
      it('appends the persisted snapshots to the store', async () => {
        const persistedSnapshot = createSnapshot({
          id: '1',
          createdAt: Date.now().toString(),
          nodes: {
            PersistedQuery: null,
          },
        });

        const newSnapshot = createSnapshot({
          id: '2',
          createdAt: Date.now().toString(),
          nodes: {
            SomeQuery: null,
          },
        });

        const store = createActivityStoreDescriptor({
          type: 'graphql',
          monitor: {
            snapshots: [newSnapshot],
          },
        });

        const storagePromise = Promise.resolve({
          // Use a proxy to return a value for each storage key
          snapshots: new Proxy(
            {},
            {
              get() {
                return {
                  graphql: [persistedSnapshot],
                };
              },
            },
          ),
        });

        const provider = await mount(<ActivityProvider activity={[store]} />, {
          extensionApi: {
            storage: {
              local: {
                get: vi.fn().mockReturnValue(storagePromise),
              },
            },
            activity: {
              preserveLog: [
                createMockStatefulRemoteSubscribable(true),
                vi.fn(),
              ],
            },
          },
        });

        await provider.act(() => storagePromise);

        expect(provider).toProvideReactContext(ActivityStoreContext, [
          expect.objectContaining({
            data: expect.objectContaining({
              rows: [
                expect.objectContaining({id: persistedSnapshot.id}),
                expect.objectContaining({id: newSnapshot.id}),
              ],
            }),
          }),
        ]);
      });
    });
  });
});

export {};

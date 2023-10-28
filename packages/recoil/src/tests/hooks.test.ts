/* eslint-disable @typescript-eslint/naming-convention */
import {Snapshot} from 'recoil';

import {transformSnapshot} from '../hooks';

describe('hooks', () => {
  describe('transform snapshot', () => {
    it('returns all keys when no include/exclude provided', () => {
      const snapshot = createSnapshot({
        id: '98',
        nodes: [
          {
            key: 'one',
            value: 1,
          },
          {
            key: 'two',
            value: 2,
          },
          {
            key: 'three',
            value: 3,
          },
        ],
      });

      const result = transformSnapshot(snapshot, {});

      expect(result.snapshot.nodes).toEqual({
        one: 1,
        two: 2,
        three: 3,
      });
    });

    it('only includes specified keys', () => {
      const snapshot = createSnapshot({
        id: '98',
        nodes: [
          {
            key: 'one',
            value: 1,
          },
          {
            key: 'two',
            value: 2,
          },
          {
            key: 'three',
            value: 3,
          },
        ],
      });

      const result = transformSnapshot(snapshot, {
        include: ['two'],
      });

      expect(result.snapshot.nodes).toEqual({
        two: 2,
      });
    });

    it('removes excluded keys', () => {
      const snapshot = createSnapshot({
        id: '98',
        nodes: [
          {
            key: 'one',
            value: 1,
          },
          {
            key: 'two',
            value: 2,
          },
          {
            key: 'three',
            value: 3,
          },
        ],
      });

      const result = transformSnapshot(snapshot, {
        include: ['two', 'three'],
        exclude: ['two'],
      });

      expect(result.snapshot.nodes).toEqual({
        three: 3,
      });
    });
  });
});

function createSnapshot({
  id,
  nodes,
}: {
  id: string;
  nodes: {key: string; value: any}[];
}): Snapshot {
  return {
    asyncMap: vi.fn(),
    getID: vi.fn(() => id as any),
    getLoadable: vi.fn((node: any) => ({getValue: () => node.value} as any)),
    getInfo_UNSTABLE: vi.fn(),
    getNodes_UNSTABLE: vi.fn(() => nodes as any),
    getPromise: vi.fn(),
    isRetained: vi.fn(),
    map: vi.fn(),
    retain: vi.fn(),
  };
}

import {DeepPartial} from 'ts-essentials';

import {ActivityStoreDescriptor, Snapshot} from '../types';

export function createActivityStoreDescriptor(
  partial?: DeepPartial<ActivityStoreDescriptor>,
): ActivityStoreDescriptor {
  const snapshot = createSnapshot(partial?.monitor?.snapshot);

  return {
    displayName: 'Something',
    type: 'something',
    icon: (typeof partial?.icon === 'object'
      ? {
          source: partial.icon.source! ?? 'cancel',
        }
      : partial?.icon ?? 'hey') as any,
    ...partial,
    monitor: {
      snapshot,
      snapshots: partial?.monitor?.snapshots?.map(createSnapshot) ?? [snapshot],
      clearSnapshots: partial?.monitor?.clearSnapshots,
      setRecordSnapshot: partial?.monitor?.setRecordSnapshot,
      skipDiffing: partial?.monitor?.skipDiffing,
      previous: createSnapshot(partial?.monitor?.previous),
    },
  };
}

export function createSnapshot(partial?: DeepPartial<Snapshot>): Snapshot {
  return {
    id: '1',
    createdAt: Date.now().toString(),
    nodes: {},
    ...partial,
  };
}

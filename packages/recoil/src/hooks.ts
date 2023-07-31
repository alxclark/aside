import {PropsWithChildren, useMemo} from 'react';
import {useRecoilSnapshot, Snapshot as RecoilSnapshot} from 'recoil';
import {useObserver, Observer, Snapshot} from '@aside/timeline';

export type Props = PropsWithChildren<{
  ignoredRecoilKeys?: string[];
}>;

export function useRecoilObserver({
  ignoredRecoilKeys,
}: {
  ignoredRecoilKeys?: string[];
} = {}): Observer {
  const recoilSnapshot = useRecoilSnapshot();
  const ignoredRecoilKeysDependency = ignoredRecoilKeys?.sort().join();

  const {snapshot} = useMemo(
    () => transformSnapshot(recoilSnapshot, {ignoredRecoilKeys}),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ignoredRecoilKeysDependency, recoilSnapshot.getID()],
  );

  return useObserver(snapshot.nodes, [snapshot.nodes]);
}

// Recoil snapshots need to be manually retained in order to extract the data from it.
// In order to make it simpler to pass it to the remote, we pre-process
// each snapshot and generate an object containing all values and a diff of the state.
function transformSnapshot(
  recoilSnapshot: RecoilSnapshot,
  options: {ignoredRecoilKeys?: string[]},
) {
  const createdAt = new Date().getTime().toString();
  const id = `${String(recoilSnapshot.getID())}-${createdAt}`;

  const snapshot: Snapshot = {
    id,
    createdAt,
    nodes: {},
  };

  for (const node of recoilSnapshot.getNodes_UNSTABLE()) {
    const parts = node.key.split('__');
    const hasAtomFamilyPrefix = parts.length > 1;

    if (hasAtomFamilyPrefix) {
      const [prefix, ...rest] = parts;

      if (options.ignoredRecoilKeys?.includes(prefix)) continue;

      const itemKey = rest
        .join('')
        .replaceAll('"', '')
        .replace('selectorFamily/', '')
        .split('/')[0];

      snapshot.nodes[prefix] ||= {};
      snapshot.nodes[prefix][itemKey] = recoilSnapshot
        .getLoadable(node)
        .getValue();
    } else {
      if (options.ignoredRecoilKeys?.includes(parts[0])) continue;
      snapshot.nodes[node.key] = recoilSnapshot.getLoadable(node).getValue();
    }
  }

  return {snapshot};
}

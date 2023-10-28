import {useMemo} from 'react';
import {useRecoilSnapshot, Snapshot as RecoilSnapshot} from 'recoil';
import {useMonitor, Monitor, Snapshot} from '@aside/activity';

export interface RecoilMonitorOptions {
  include?: string[];
  exclude?: string[];
}

export function useRecoilMonitor(options: RecoilMonitorOptions): Monitor {
  const recoilSnapshot = useRecoilSnapshot();
  const keyDependency = `${options.include?.sort().join()}-${options.exclude
    ?.sort()
    .join()}`;

  const {snapshot} = useMemo(
    () => transformSnapshot(recoilSnapshot, options),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [keyDependency, recoilSnapshot.getID()],
  );

  return useMonitor(snapshot.nodes, [snapshot.nodes]);
}

// Recoil snapshots need to be manually retained in order to extract the data from it.
// In order to make it simpler to pass it to the remote, we pre-process
// each snapshot and generate an object containing all values and a diff of the state.
export function transformSnapshot(
  recoilSnapshot: RecoilSnapshot,
  options?: RecoilMonitorOptions,
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

      if (options?.exclude?.includes(prefix)) continue;
      if (
        options?.include &&
        options.include?.length > 0 &&
        !options.include?.includes(prefix)
      ) {
        continue;
      }

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
      if (options?.exclude?.includes(parts[0])) continue;
      if (
        options?.include &&
        options.include?.length > 0 &&
        !options.include?.includes(parts[0])
      ) {
        continue;
      }

      snapshot.nodes[node.key] = recoilSnapshot.getLoadable(node).getValue();
    }
  }

  return {snapshot};
}

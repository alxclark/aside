import {useNetwork} from '@aside/react';
import {type NetworkRequest} from '@aside/core';
import {useMemo} from 'react';

import {ActivityStoreDescriptor, Snapshot} from '../types';

export function useNetworkActivity() {
  const {requests, clear} = useNetwork();

  const networkActivity: ActivityStoreDescriptor<Snapshot<NetworkRequest>> =
    useMemo(() => {
      const snapshots = requests.map(createSnapshot);

      return {
        displayName: 'Network',
        type: 'network',
        icon: getNetworkIcon,
        rowName: getNetworkRowName,
        monitor: {
          snapshot: snapshots[snapshots.length - 1],
          snapshots,
          clearSnapshots: clear,
        },
      };
    }, [clear, requests]);

  return networkActivity;
}

function getNetworkRowName(row: Snapshot<NetworkRequest>) {
  if (!row?.nodes.request.url) {
    return row.nodes._resourceType;
  }
  const urlParts = row.nodes.request.url.split('/');
  const lastUrlPath = urlParts.reverse().find((part) => part.length > 0);

  if (!lastUrlPath || lastUrlPath.length === 0) {
    return row.nodes._resourceType;
  }

  return lastUrlPath.split('?')[0];
}

function createSnapshot(request: NetworkRequest): Snapshot<NetworkRequest> {
  return {
    id:
      request.startedDateTime +
      request.request.url +
      request?.time +
      request.request.method,
    createdAt: new Date(request.startedDateTime).getTime().toString(),
    nodes: request,
  };
}

const getNetworkIcon: ActivityStoreDescriptor<
  Snapshot<NetworkRequest>
>['icon'] = (row) => {
  if (row.nodes._resourceType === 'image') {
    return row.nodes.request.url;
  }

  if (row.nodes._resourceType === 'script') {
    return {
      source: 'file-script',
      variant: 'yellow',
    };
  }

  return {
    source: 'file-script',
    variant: 'default',
  };
};

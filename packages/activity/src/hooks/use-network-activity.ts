import {useNetworkRequests} from '@aside/react';
import {NetworkRequest} from '@aside/core';
import {useMemo} from 'react';

import {ActivityStoreDescriptor, Snapshot} from '../types';

export function useNetworkActivity() {
  const networkRequests = useNetworkRequests();

  const networkActivity: ActivityStoreDescriptor<Snapshot<NetworkRequest>> =
    useMemo(() => {
      const last = networkRequests[networkRequests.length - 1];

      return {
        displayName: 'Network',
        type: 'network',
        icon: (row) => {
          return {
            source: 'cog',
            variant: 'toggled',
          };
        },
        rowName: (row) => {
          if (!row?.nodes.request?.url) return row.nodes.type;
          const urlParts = row.nodes.request.url.split('/');
          const lastUrlPath = urlParts[urlParts.length - 1];

          if (lastUrlPath.length === 0) {
            return row.nodes.type;
          }

          return lastUrlPath;
        },
        monitor: {
          snapshot: {
            id: last?.time.toString() + last?.request.url,
            createdAt: last?.time.toString(),
            nodes: last,
          },
          snapshots: networkRequests.map((request) => ({
            id: request.time.toString() + request.request.url,
            createdAt: request.time.toString(),
            nodes: request,
          })),
          skipDiffing: true,
        },
      };
    }, [networkRequests]);

  return networkActivity;
}

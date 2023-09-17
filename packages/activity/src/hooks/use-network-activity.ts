import {useNetwork} from '@aside/react';
import {NetworkRequest} from '@aside/core';
import {useMemo} from 'react';

import {ActivityStoreDescriptor, Snapshot} from '../types';

export function useNetworkActivity() {
  const {requests, clear} = useNetwork();

  const networkActivity: ActivityStoreDescriptor<Snapshot<NetworkRequest>> =
    useMemo(() => {
      const last = requests[requests.length - 1];

      return {
        displayName: 'Network',
        type: 'network',
        icon: (row) => {
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
        },
        rowName: (row) => {
          if (!row?.nodes.request.url) {
            return row.nodes._resourceType;
          }
          const urlParts = row.nodes.request.url.split('/');
          const lastUrlPath = urlParts
            .reverse()
            .find((part) => part.length > 0);

          if (!lastUrlPath || lastUrlPath.length === 0) {
            return row.nodes._resourceType;
          }

          return lastUrlPath;
        },
        monitor: {
          snapshot: {
            id: last?.time.toString() + last?.request.url,
            createdAt: last?.startedDateTime,
            nodes: last,
          },
          snapshots: requests.map((request) => ({
            id: request.time.toString() + request.request.url,
            createdAt: request.startedDateTime,
            nodes: request,
          })),
          skipDiffing: true,
          clearSnapshots: () => clear(),
        },
      };
    }, [clear, requests]);

  return networkActivity;
}

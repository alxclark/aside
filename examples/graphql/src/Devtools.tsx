import {useApolloClient} from '@apollo/client';
import {
  ActivityStoreDescriptor,
  useNetworkActivity,
  ActivityProvider,
  Activity,
  ActivityDetails,
  ActivityView,
  useMonitor,
  Snapshot,
  NetworkDetails,
} from '@aside/activity';
import {
  Pane,
  Tabs,
  PaneToolbar,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@aside/chrome-ui-remote';
import {Capability} from '@aside/core';
import {
  Aside,
  Devtools as AsideDevtools,
  useExtensionApi,
  useLocalStorageState,
} from '@aside/react';
import React, {
  useMemo,
  PropsWithChildren,
  useEffect,
  useState,
  useCallback,
} from 'react';

export function Devtools() {
  const client = useApolloClient();
  const [cache, setCache] = useState(client.cache.extract(true));

  const refreshCache = useCallback(() => {
    setCache(client.cache.extract(true));
  }, [client.cache]);

  const graphQLMonitor = useMonitor(cache, [cache]);

  const postMessageActivity = usePostMessageActivity();

  const appActivity: ActivityStoreDescriptor[] = useMemo(
    () => [
      {
        type: 'graphql',
        displayName: 'GraphQL',
        monitor: graphQLMonitor,
        icon: 'https://graphql.org/img/logo.svg',
      },
      postMessageActivity as any,
    ],
    [graphQLMonitor, postMessageActivity],
  );

  const capabilities: Capability[] = useMemo(() => ['network'], []);

  return (
    <Aside>
      <AsideDevtools capabilities={capabilities}>
        <AppActivityProvider activity={appActivity} refreshCache={refreshCache}>
          <AsideApp />
        </AppActivityProvider>
      </AsideDevtools>
    </Aside>
  );
}

function AppActivityProvider({
  activity,
  children,
  refreshCache,
}: PropsWithChildren<{
  activity: ActivityStoreDescriptor[];
  refreshCache: () => void;
}>) {
  const networkActivity = useNetworkActivity();
  const {
    network: {onRequestFinished},
  } = useExtensionApi();

  // Apollo does not have an easy way to just subscribe to
  // cache changes and query/mutation events.
  // Instead this will inspect network requests going through
  // the browser and when a GraphQL request is identified,
  // will extract the GraphQL cache.
  useEffect(() => {
    const result = onRequestFinished((request) => {
      if (
        request._resourceType === 'fetch' &&
        request.request.method === 'POST' &&
        request.request.postData.mimeType === 'application/json'
      ) {
        const requestBody = JSON.parse(request.request.postData.text);
        const isGraphQLQuery =
          requestBody.operationName &&
          requestBody.query &&
          requestBody.variables;

        if (isGraphQLQuery) {
          refreshCache();
        }
      }
    });

    return () => {
      // eslint-disable-next-line promise/catch-or-return
      result.then((unsubscribe) => unsubscribe());
    };
  }, [onRequestFinished, refreshCache]);

  return (
    <ActivityProvider activity={[...activity, networkActivity]}>
      {children}
    </ActivityProvider>
  );
}

function AsideApp() {
  const [tab, setTab] = useLocalStorageState('activity', {
    key: 'tab',
  });

  if (tab.loading) return null;

  return (
    <Pane>
      <Tabs defaultValue={tab.data} onValueChange={setTab}>
        <PaneToolbar>
          <TabsList>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="graphql">GraphQL</TabsTrigger>
          </TabsList>
        </PaneToolbar>

        <TabsContent value="activity">
          <Activity
            storage={{
              disabled: false,
            }}
          >
            <ActivityDetails type="graphql" />
            <NetworkDetails />
            <ActivityDetails type="remote-ui" />
          </Activity>
        </TabsContent>
        <TabsContent value="graphql">
          <ActivityView type="graphql" />
        </TabsContent>
      </Tabs>
    </Pane>
  );
}

interface RemoteUIEvent {
  operationName: string;
  id: string;
  variables?: any;
  response?: any;
}

function usePostMessageActivity(): ActivityStoreDescriptor<
  Snapshot<RemoteUIEvent>
> {
  const [snapshots, setSnapshots] = useState<Snapshot<RemoteUIEvent>[]>([]);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const {data} = event;

      const isRemoteUICall = Array.isArray(data) && data[0] === 0;
      const isRemoteUIResult = Array.isArray(data) && data[0] === 1;

      if (isRemoteUICall) {
        setSnapshots((snapshots) => [
          ...snapshots,
          {
            id: data[1][0],
            createdAt: Date.now().toString(),
            nodes: {
              id: data[1][0],
              operationName: data[1][1],
              variables: data[1][2],
            },
            initial: snapshots.length === 0,
          },
        ]);

        return;
      }

      if (isRemoteUIResult) {
        setSnapshots((snapshots) => {
          const snapshotMatchingResponse = snapshots.find(
            (snapshot) => snapshot.id === data[1][0],
          );

          if (!snapshotMatchingResponse) return snapshots;

          return [
            ...snapshots.filter((snapshot) => snapshot.id !== data[1][0]),
            {
              ...snapshotMatchingResponse,
              nodes: {
                ...snapshotMatchingResponse.nodes,
                response: data[1][2],
              },
            },
          ];
        });
      }
    }

    window.addEventListener('message', onMessage);

    return () => {
      window.removeEventListener('message', onMessage);
    };
  }, []);

  return {
    type: 'remote-ui',
    displayName: 'Remote UI',
    rowName: (row) => row.nodes.operationName,
    monitor: {
      snapshot: snapshots[snapshots.length - 1],
      snapshots,
      clearSnapshots: () => setSnapshots([]),
    },
  };
}

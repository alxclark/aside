import {useApolloClient} from '@apollo/client';
import {
  ActivityStoreDescriptor,
  useNetworkActivity,
  ActivityProvider,
  Activity,
  ActivityDetails,
  ActivityView,
  useMonitor,
} from '@aside/activity';
import {
  Pane,
  Tabs,
  PaneToolbar,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@aside/chrome-ui-remote';
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

  const appActivity: ActivityStoreDescriptor[] = useMemo(
    () => [
      {
        type: 'graphql',
        displayName: 'GraphQL',
        monitor: graphQLMonitor,
        icon: 'https://graphql.org/img/logo.svg',
      },
    ],
    [graphQLMonitor],
  );

  return (
    <Aside>
      <AsideDevtools>
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
            <ActivityDetails type="network" />
          </Activity>
        </TabsContent>
        <TabsContent value="graphql">
          <ActivityView type="graphql" />
        </TabsContent>
      </Tabs>
    </Pane>
  );
}

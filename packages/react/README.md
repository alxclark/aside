# react

## Speculative api

### Simple use case

Consumers can pass in any components from `@companion/react` to the `Companion` component, which will render its children using the remote renderer.

```tsx
import React, {useState} from 'react';
import {Companion, DevTools, Button} from '@companion/react';

function App() {
  const [count, setCount] = useState(0);

  function increment() {
    setCount(prev => prev + 1)
  }

  return (
    <>
      <p>Count: {count}</p>
      <Companion>
        <DevTools>
          <Button onPress={increment}>Increment</Button>
        </DevTools>
      </Companion>
    </>
  )
}
```

### Background page remote

In some cases, you might want to run a component lifecycle in the background page.

```tsx
import React, {useState, useEffect} from 'react';
import {Companion, Button, useSharedState} from '@companion/react';

function App() {
  const [count, setCount] = useState(0);

  function increment() {
    setCount(prev => prev + 1)
  }

  return (
    <>
      <p>Count: {count}</p>
      <Companion>
        <DevTools>
          <Button onPress={increment}>Increment</Button>
        </DevTools>
        <Background>
          <StateObserver state={{count}} />
        </Background>
      </Companion>
    </>
  )
}

function StateObserver({state}) {
  const [, setSharedState] = useSharedState()

  useEffect(() => {
    setSharedState((prev) => ({...prev, states: [...prev.states, {state, updatedAt: Date.now()}]}))
  }, [state])

  return null;
}

function StateLogs() {
  const [sharedState] = useSharedState()

  return (
    <List>
      {sharedState.states.map(({state, updatedAt}) => (
        <ListItem key={updatedAt}>
          {updatedAt}: {JSON.stringify(state)}
        </ListItem>
      ))}
    </List>
  )
}
```

### Devtools example

If you need the remote to have access to context providers or internal state from your application, you can wrap over the companion components to read from your data source and send the subset of data your remote needs through props.

```tsx
import React, {useState} from 'react';
import {Companion, DevTools, Button} from '@companion/react';
import {RecoilDevTools} from '@companion/recoil';

function App() {
  const [count, setCount] = useState(0);

  function increment() {
    setCount(prev => prev + 1)
  }

  return (
    <>
      <p>Count: {count}</p>
      <RecoilDevTools />
    </>
  )
};

// @companion/recoil
import React, {useState} from 'react';
import {Companion, DevTools, List, ListItem} from '@companion/react';
import {useRecoilTransactionObserver_UNSTABLE} from 'recoil';

export function RecoilDevTools({children}) {
  const [snapshots, setSnapshots] = useState([]);

  useRecoilTransactionObserver_UNSTABLE(({snapshot}) => {
    setSnapshots(prev => ([...prev, snapshot]));
  });

  return (
    <Companion>
      <DevTools>
        <List>
          {snapshots.map(snapshot => (
            <ListItem key={snapshot.id}>
              {JSON.stringify(snapshot)}
            </ListItem>
          ))}
          {children}
        </List>
      </DevTools>
    </Companion>
  )
}
```

For library authors, we recommend to allow your users to extend your own UI. The Panel components uses React portals to render inside the panels you've created or even replace them completely.

```tsx
import React, {useState} from 'react';
import {Panel, Button} from '@companion/react';
import {RecoilDevTools} from '@companion/recoil';

function App() {
  const [count, setCount] = useState(0);

  function increment() {
    setCount(prev => prev + 1)
  }

  return (
    <>
      <p>Count: {count}</p>
      <RecoilDevTools>
        <Panel id="recoil-states" extend>
          <Button onPress={increment}>Increment</Button>
        </Panel>
        <Panel id="extra-controls" title="Extra controls">
          <Button onPress={increment}>Increment</Button>
        </Panel>
        <Panel id="recoil-graph" replace>
          <Button onPress={increment}>Increment</Button>
        </Panel>
      </RecoilDevTools>
    </>
  )
};
```
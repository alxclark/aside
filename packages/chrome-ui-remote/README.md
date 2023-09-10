# `@aside/chrome-ui-remote`

This package provides utilities to build UIs for the Aside Chrome extension, and is the remote counterpart to `@aside/chrome-ui`.

## Installation

```
yarn add @aside/chrome-ui-remote
```

## Usage

```tsx
import {Aside, Devtools} from '@aside/react';
import {Button} from '@aside/chrome-ui-remote';

function App() {
  return (
    <Aside>
      <Devtools>
        <Button>Click me!</Button>
      </Devtools>
    </Aside>
  );
}
```

import {Highlight, themes} from 'prism-react-renderer';

import {webstoreUrl} from '@/constants';
import {Codeblock, Link, ListItem} from '@/components';

export default function GettingStarted() {
  return (
    <>
      <h1>Getting started</h1>
      <p className="mt-3 text-lg">
        Aside is a modular browser extension built to be a companion to any web
        application. <br />
        <br /> Users can use React&apos;s primitives to render UI directly into
        the developer tools panel of the browser. Aside&apos;s npm packages
        exposes UI components and utilities to access the Chrome extension APIs
        from the comfort of your own web application.
      </p>

      <h2 className="mt-8">Installation</h2>

      <ol className="mt-7 flex flex-col gap-10">
        <ListItem index={1}>
          <h4 className="font-medium dark:text-dark-foreground mb-3">
            Download the browser extension
          </h4>
          <p>
            Dowload the extension on the{' '}
            <Link external to={webstoreUrl}>
              Chrome web store
            </Link>
            .
          </p>
        </ListItem>
        <ListItem index={2}>
          <h4 className="font-medium dark:text-dark-foreground mb-3">
            Install the npm packages
          </h4>
          <p className="mb-5">
            Install @aside/react as one of your project's dependencies.
          </p>
          <Codeblock codeBlock={yarnInstall} language="" />
        </ListItem>
        <ListItem index={3}>
          <h4 className="font-medium dark:text-dark-foreground mb-3">
            Import Aside, DevTools and UI components
          </h4>
          <p className="mb-5">
            Render both components into your application and you now have a
            portal to render directly into the Chrome developer tool panel!
          </p>
          <Codeblock codeBlock={imports} language="tsx" />

          <p className="my-5">
            In the example below, we are using Button from @aside/chrome-ui.
            Chrome UI is one of the UI packages that Aside offers. It mirrors
            the native Chrome look and feel and is our recommendation for new
            users.
          </p>
          <Codeblock codeBlock={buttonRender} language="tsx" />
        </ListItem>
        <ListItem index={4}>
          <h4 className="font-medium dark:text-dark-foreground mb-3">
            Open Aside in the Chrome developer tools
          </h4>
          <p>
            A new tab called Aside will now show up in your browser developer
            tools, and you should now see the button you have rendered 🎉.
          </p>
        </ListItem>
      </ol>

      <h2 className="mt-8 mb-5">Example</h2>

      <p className="mb-5">
        The power of Aside is that you can mix your own app code, state and
        logic and have it power what will render in the browser developer tool.
        You can even provide Aside's components callbacks to update your own app
        state and it will work as expected.
      </p>

      <Codeblock language="tsx" codeBlock={buttonExample} />
    </>
  );
}

const yarnInstall = `yarn install @aside/react @aside/chrome-ui`;
const imports = `import {Aside, DevTools} from '@aside/react';
import {Button} from '@aside/chrome-ui';`;
const buttonRender = `<Aside>
  <DevTools>
    <Button
      onPress={() => console.log('Pressed !')}
    >
      Press me!
    </Button>
  </DevTools>
</Aside>`;
const buttonExample = `import React, {useState} from 'react';
import {Aside, DevTools} from '@aside/react';
import {Button} from '@aside/chrome-ui';

export function App({children}) {
  const [count, setCount] = useState(0)

  return (
    <div>
      {count}
      <Aside>
        <DevTools>
          <Button
            onPress={(prev) => setCount(prev + 1)}
          >
            Increment
          </Button>
        </DevTools>
      </Aside>
    </div>
  );
}`;

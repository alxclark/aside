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
            Import {'<Aside />'} and {'<DevTools />'}
          </h4>
          <p className="mb-5">
            Render both components into your application and you now have a
            portal to render directly into the Chrome developer tool panel!
          </p>
          <Codeblock codeBlock={buttonExample} language="tsx" />

          <p className="my-5">
            In the example above, we are using Button from @aside/chrome-ui.
            Chrome UI is one of the UI packages that Aside offers. It mirrors
            the native Chrome look and feel and is our recommendation for new
            users.
          </p>
        </ListItem>
      </ol>
    </>
  );
}

const yarnInstall = `yarn install @aside/react @aside/chrome-ui`;
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

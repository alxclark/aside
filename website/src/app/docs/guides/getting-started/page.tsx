import {
  AsideSandbox,
  Button,
  Codeblock,
  Heading,
  Link,
  ListItem,
} from '@/components';
import {webstoreUrl} from '@/constants';

export default function GettingStarted() {
  return (
    <>
      <Heading level={1}>Getting started</Heading>
      <Heading level={2} className="mt-8">
        Introduction
      </Heading>
      <p className="mt-3">
        Aside is an extensible{' '}
        <Link external to="https://developer.chrome.com/docs/extensions/">
          Chrome extension
        </Link>{' '}
        that allows webpages to customize the interface of the{' '}
        <Link external to="https://developer.chrome.com/docs/devtools/">
          devtools panel
        </Link>
        . We make it easy for developers to enhance their development
        experience, without the friction of having to build dedicated Chrome
        extensions.
      </p>

      <Heading level={2} className="mt-8">
        Installation
      </Heading>

      <ol className="mt-7 flex flex-col gap-10">
        <ListItem index={1}>
          <Heading level={4} className="mb-3">
            Download the browser extension
          </Heading>
          <p>
            Dowload the extension on the{' '}
            <Link external to={webstoreUrl}>
              Chrome web store
            </Link>
            .
          </p>
        </ListItem>
        <ListItem index={2}>
          <Heading level={4} className="mb-3">
            Install the npm packages
          </Heading>
          <p className="mb-5">
            Install @aside/react as one of your project&apos;s dependencies.
          </p>
          <Codeblock codeBlock={yarnInstall} language="" />
        </ListItem>
        <ListItem index={3}>
          <Heading level={4} className="mb-3">
            Import Aside, Devtools and UI components
          </Heading>
          <p className="mb-5">
            Render both components into your application and you now have a
            portal to render directly into the Chrome developer tool panel!
          </p>
          <Codeblock codeBlock={imports} language="tsx" />

          <p className="my-5">
            In the example below, we are using Button from
            @aside/chrome-ui-remote. Chrome UI is one of the UI packages that
            Aside offers. It mirrors the native Chrome look and feel and is our
            recommendation for new users.
          </p>
          <Codeblock codeBlock={buttonRender} language="tsx" />
        </ListItem>
        <ListItem index={4}>
          <Heading level={4} className="mb-3">
            Open Aside in the Chrome developer tools
          </Heading>
          <p>
            A new tab called Aside will now show up in your browser developer
            tools, and you should now see the button you have rendered{' '}
            <span role="img" aria-label="Tada">
              🎉
            </span>
            .
          </p>
        </ListItem>
      </ol>

      <Heading level={2} className="mt-8 mb-5">
        Example
      </Heading>

      <p className="mb-5">
        The power of Aside is that you can mix your own app code, state and
        logic and have it power what will render in the developer tools panel.
        You can even provide Aside&apos;s components callbacks to update your
        own app state and it will work as expected.
      </p>

      <AsideSandbox
        height={200}
        code={buttonExample}
        scope={{
          MyButton: Button,
        }}
      />

      <div className="mb-10" />
    </>
  );
}

const yarnInstall = `yarn install @aside/react @aside/chrome-ui`;
const imports = `import {Aside, Devtools} from '@aside/react';
import {Button} from '@aside/chrome-ui';`;
const buttonRender = `<Aside>
  <Devtools>
    <Button
      onPress={() => console.log('Pressed !')}
    >
      Press me!
    </Button>
  </Devtools>
</Aside>`;
const buttonExample = `function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <MyButton onPress={() => setCount(count + 1)}>Increment</ MyButton>
      <Aside>
        <Devtools>
          <ConsoleMessage value={{count}} />
        </Devtools>
      </Aside>
    </div>
  );
};`;

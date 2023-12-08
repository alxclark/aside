import {
  AsideSandbox,
  Button,
  Codeblock,
  Heading,
  Link,
  ListItem,
} from '@/components';
import {webstoreUrl} from '@/constants';

export default function Activity() {
  return (
    <>
      <Heading level={1}>React</Heading>
      <p className="mt-3 text-lg">
        Aside is a modular browser extension built to be a companion to any web
        application. <br />
        <br /> Users can use React&apos;s primitives to render UI directly into
        the developer tools panel of the browser. Aside&apos;s npm packages
        exposes UI components and utilities to access the Chrome extension APIs
        from the comfort of your own web application.
      </p>

      {/* <AsideSandbox
        height={200}
        code={buttonExample}
        scope={{
          MyButton: Button,
        }}
      /> */}

      <div className="mb-10" />
    </>
  );
}

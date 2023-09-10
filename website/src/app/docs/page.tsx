import {AsideSandbox, Button, Heading} from '@/components';

export default function DocsPage() {
  return (
    <>
      <div className="text-center mb-20">
        <Heading level={1} className="text-6xl">
          aside
        </Heading>
        <p className="text-2xl mt-2">
          The browser extension for modern development
        </p>
        <div className="flex justify-center gap-2 mt-5">
          <Button href="/docs/guides/getting-started">Get started</Button>
          <Button variant="subdued" href="/docs/apis/react">
            Learn more
          </Button>
        </div>
      </div>
      <div>
        <div className="text-center mb-8">
          <Heading level={2} className="text-4xl">
            Extend the developer tools without an extension
          </Heading>
          <p className="text-2xl mt-3">
            Aside let's you build user interfaces for the browser developer
            tools directly from your own webpage. No more inconsistent and
            disjoint experiences during development.
          </p>
        </div>
        <AsideSandbox
          code={buttonExample}
          height={200}
          display="code-extension"
        />
      </div>
    </>
  );
}

const buttonExample = `function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Aside>
        <Devtools>
          <ConsoleMessage value={{count}} />
        </Devtools>
      </Aside>
    </div>
  );
};`;

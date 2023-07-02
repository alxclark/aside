import {webstoreUrl} from '@/constants';

export default function GettingStarted() {
  return (
    <>
      <h1>Getting started</h1>
      <p className="mt-3 text-lg">
        Aside is a modular browser extension built to be a companion to any web
        application. <br />
        <br /> Users can render components
      </p>

      <h2 className="mt-8">Installation</h2>

      <ol className="mt-3">
        <li>
          <h4>
            Install the browser extension
            <p>
              Dowload the extension on the Chrome web store{' '}
              <a href={webstoreUrl}>here</a>.
            </p>
          </h4>
        </li>
      </ol>
    </>
  );
}

import clsx from 'clsx';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

// eslint-disable-next-line @shopify/strict-component-boundaries
import {Examples} from '../components/Examples/Examples';

import styles from './index.module.css';

function ExamplesHeader() {
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          Examples
        </Heading>
        <p className="hero__subtitle">Explore what&apos;s possible</p>
      </div>
    </header>
  );
}

export default function ExamplesPage(): JSX.Element {
  return (
    <Layout
      title="Aside developer tools"
      description="Description will go into a meta tag in <head />"
    >
      <ExamplesHeader />
      <main>
        <Examples />
      </main>
    </Layout>
  );
}

import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <div className={styles.page}>
      <Layout
        title="Aside developer tools"
        description="Description will go into a meta tag in <head />"
      >
        <div className={styles.container}>
          <div className={styles.intro}>
            <div>
              <img
                className={styles.arrow}
                src="/img/curly-dashed.svg"
                alt=""
              />
            </div>
            <Heading as="h1" className="hero__title">
              The extensible <br /> developer tools
            </Heading>
            <p className={styles.text}>
              Aside is a Chrome extension that can render{' '}
              <strong>UI natively in the developer tools panel</strong>,
              controlled by your own React website. <br />
              <br />
              It exposes a variety of APIs to empower your developer experience,
              without the friction of traditional Chrome extensions.
            </p>
            <div className={styles.buttons}>
              <Link className={styles.button} to="/docs/getting-started">
                Get started
              </Link>
              <Link
                className={clsx(styles.button, styles['button--primary'])}
                to="https://aside.dev/download"
              >
                Download
              </Link>
            </div>
          </div>
          <img className={styles.code} src="/img/code.png" alt="" />
        </div>
      </Layout>
    </div>
  );
}

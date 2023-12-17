/* eslint-disable @shopify/jsx-prefer-fragment-wrappers */
import styles from './styles.module.css';

const examples = [
  {
    title: 'GraphQL',
    description: 'Show Apollo cache changes.',
    href: 'https://graphql.aside.dev',
    iconUrl: 'img/graphql.svg',
    background: '#f6009b',
  },
  {
    title: 'Recoil',
    description: 'Show atom and selector changes.',
    href: 'https://recoil.aside.dev',
    iconUrl: 'img/recoil.png',
    background: '#007af4',
  },
];

export function Examples() {
  return (
    <div className={styles.grid}>
      {examples.map((example) => (
        <a className={styles.item} key={example.title} href={example.href}>
          <div className={styles.icon} style={{background: example.background}}>
            <img src={example.iconUrl} alt={example.title} />
          </div>
          <div>
            <div className={styles.title}>{example.title}</div>
            <div className={styles.description}>{example.description}</div>
          </div>
        </a>
      ))}
    </div>
  );
}

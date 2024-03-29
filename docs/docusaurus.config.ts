import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'aside',
  tagline: 'An extensible developer tools extension for Chrome',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://aside.dev',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'alxclark', // Usually your GitHub org/user name.
  projectName: 'aside', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/alxclark/aside/tree/main/docs/',
          remarkPlugins: [
            [require('@docusaurus/remark-plugin-npm2yarn'), {sync: true}],
          ],
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/alxclark/aside/tree/main/docs/',
          remarkPlugins: [
            [
              require('@docusaurus/remark-plugin-npm2yarn'),
              {converters: ['pnpm']},
            ],
          ],
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      // title: 'aside',
      logo: {
        alt: 'aside logo',
        src: 'img/curly.svg',
        srcDark: 'img/curly-light.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {to: '/examples', label: 'Examples', position: 'left'},
        {
          href: 'https://github.com/alxclark/aside',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting started',
              to: '/docs/introduction/getting-started',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/aside-dev',
            },
            {
              label: '𝕏 (Twitter)',
              href: 'https://x.com/aside_dev',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/alxclark/aside',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} aside, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.vsDark,
    },
  } satisfies Preset.ThemeConfig,

  plugins: [
    async function chromeUIPlugin(context, options) {
      return {
        name: 'chrome-ui',
        configureWebpack: (config) => {
          const updatedRules = config.module.rules.map((rule) => {
            const isCSSRule = rule && typeof rule === 'object' && rule?.test?.toString() === /\.css$/i.toString()

            if (isCSSRule) {
              return {
                ...rule,
                exclude: (path) => {
                  const originalExclude = (rule?.exclude as any)?.test(path)
                  return originalExclude || path.includes('chrome-ui/build/css/styles.css')
                },
              }
            }

            return rule
          })

          const cssStyleSheetRule = {
            assert: { type: "css" },
            loader: "css-loader",
            options: {
              exportType: "css-style-sheet",
            },
            test: (path) => {
              return path.includes('chrome-ui/build/css/styles.css')
            },
          };

          return {
            module: {
              ...config.module,
              rules: [
                cssStyleSheetRule,
                ...updatedRules,
              ]
            },
            mergeStrategy: {
              module: 'replace',
              resolve: 'merge'
            }
          };
        }
      };
    },
    [
      'docusaurus-plugin-react-docgen-typescript',
      /** @type {import('docusaurus-plugin-react-docgen-typescript').Options} */
      {
        // pass in a single string or an array of strings
        src: ['../packages/**/*.tsx'],
        parserOptions: {
          // pass parserOptions to react-docgen-typescript
          // here is a good starting point which filters out all
          // types from react
          propFilter: (prop, component) => {
            if (prop.parent) {
              return !prop.parent.fileName.includes('@types/react');
            }

            return true;
          },
        },
      },
    ],
  ]
};

export default config;

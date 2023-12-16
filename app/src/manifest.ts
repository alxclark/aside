/* eslint-disable @typescript-eslint/naming-convention */
import fs from 'fs-extra';
import type {Manifest} from 'webextension-polyfill';

import type PkgType from '../package.json';
import {isDev, port, r} from '../scripts/utils';

export async function getManifest() {
  const pkg = (await fs.readJSON(r('package.json'))) as typeof PkgType;

  // update this file to update this manifest.json
  // can also be conditional based on your need
  const manifest: Manifest.WebExtensionManifest & {key?: string} = {
    manifest_version: 3,
    name: pkg.displayName || pkg.name,
    version: pkg.version,
    description: pkg.description,
    // browser_action: {
    //   default_icon: './assets/icon-512.png',
    //   default_popup: './dist/pages/popup/index.html',
    // },
    // options_ui: {
    //   page: './dist/pages/options/index.html',
    //   open_in_tab: true,
    // },
    background: {
      // page: './dist/pages/background/index.html',
      // persistent: false,
      service_worker: './dist/background/index.global.js',
      type: 'module',
    } as any,
    action: {
      default_icon: {
        16: './assets/logo-16.png',
        48: './assets/logo-48.png',
        128: './assets/logo-128.png',
      },
    },
    icons: {
      16: './assets/logo-16.png',
      48: './assets/logo-48.png',
      128: './assets/logo-128.png',
    },
    permissions: isDev
      ? ['scripting', 'storage', 'unlimitedStorage', 'webNavigation']
      : ['storage', 'unlimitedStorage', 'webNavigation'],
    host_permissions: ['http://*/', 'https://*/'],
    content_scripts: [
      {
        run_at: 'document_start',
        matches: ['<all_urls>'],
        js: ['./dist/contentScripts/index.global.js'],
      },
    ],
    devtools_page: './dist/pages/devtools/index.html',
    // web_accessible_resources: [
    //   {
    //     resources: ['dist/contentScripts/style.css'],
    //     matches: ['http://*/', 'https://*/'],
    //   },
    // ],
  };

  if (process.env.MANIFEST_KEY) {
    manifest.key = process.env.MANIFEST_KEY;
  }

  if (isDev) {
    // for content script, as browsers will cache them for each reload,
    // we use a background script to always inject the latest version
    // see src/background/contentScriptHMR.ts
    delete manifest.content_scripts;

    // this is required on dev for Vite script to load
    manifest.content_security_policy = {
      extension_pages: `script-src 'self' http://localhost:${port}; object-src 'self'`,
    };
  }

  return manifest;
}

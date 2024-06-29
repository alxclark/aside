// Providing node's globals since this file will only be executed by Node when calling one of the scripts.
/// <reference types="node" />

import * as fs from 'fs-extra';
import type {Manifest} from 'webextension-polyfill';

import type PackageJson from '../package.json';
import {isDev, port, resolve} from './utilities';

export async function createManifest() {
  const packageJson: typeof PackageJson = await fs.readJSON(
    resolve('package.json'),
  );

  const manifest: Manifest.WebExtensionManifest & {key?: string} = {
    manifest_version: 3,
    name: packageJson.displayName || packageJson.name,
    version: packageJson.version,
    description: packageJson.description,
    background: {
      service_worker: './build/background/entry.js',
      type: 'module',
    },
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
      ? ['storage', 'unlimitedStorage', 'webNavigation', 'scripting']
      : ['storage', 'unlimitedStorage', 'webNavigation'],
    host_permissions: ['http://*/', 'https://*/'],
    content_scripts: [
      {
        run_at: 'document_start',
        matches: ['<all_urls>'],
        js: ['./build/content/entry.js'],
      },
    ],
    devtools_page: './build/devtools/index.html',
  };

  if (process.env.MANIFEST_KEY) {
    manifest.key = process.env.MANIFEST_KEY;
  }

  if (isDev) {
    // for content script, as browsers will cache them for each reload,
    // we use a background script to always inject the latest version
    // see src/background/contentScriptHMR.ts
    // delete manifest.content_scripts;

    // this is required on dev for Vite script to load
    manifest.content_security_policy = {
      extension_pages: `script-src 'self' http://localhost:${port}; object-src 'self'`,
    };
  }

  return manifest;
}

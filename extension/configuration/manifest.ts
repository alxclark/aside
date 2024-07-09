// Providing node's globals since this file will only be executed by Node when calling one of the scripts.
/// <reference types="node" />

import type {Manifest} from 'webextension-polyfill';

import packageJson from '../package.json';
import {isDev, port, resolve as rootResolve} from './utilities';

export async function createManifest() {
  const resolve = rootResolve(isDev ? 'build/.dev' : 'build');

  const manifest: Manifest.WebExtensionManifest & {key?: string} = {
    manifest_version: 3,
    name: packageJson.displayName || packageJson.name,
    version: packageJson.version,
    description: packageJson.description,
    background: {
      service_worker: './background.js',
      type: 'module',
    },
    action: {
      default_icon: {
        16: './icons/logo-16.png',
        48: './icons/logo-48.png',
        128: './icons/logo-128.png',
      },
    },
    icons: {
      16: './icons/logo-16.png',
      48: './icons/logo-48.png',
      128: './icons/logo-128.png',
    },
    permissions: isDev
      ? ['storage', 'unlimitedStorage', 'webNavigation', 'scripting']
      : ['storage', 'unlimitedStorage', 'webNavigation'],
    host_permissions: ['http://*/', 'https://*/'],
    content_scripts: [
      {
        run_at: 'document_start',
        matches: ['<all_urls>'],
        js: ['./content-entry.iife.js'],
      },
    ],
    devtools_page: isDev
      ? `http://localhost:${port}/devtools.html`
      : './devtools/devtools.html',
    web_accessible_resources: [
      {
        matches: ['<all_urls>'],
        resources: ['content.js'],
      },
    ],
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

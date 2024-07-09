import fs from 'fs-extra';

import {isDev, resolve} from '../configuration/utilities';

import {createManifest} from '../configuration/manifest';

async function writeManifest() {
  const path = resolve(isDev ? '.dev/manifest.json' : 'build/manifest.json');

  if (isDev) {
    await fs.ensureDir(resolve('.dev'));
  }

  return await fs.writeJSON(path, await createManifest(), {
    spaces: 2,
  });
}

export async function run() {
  return writeManifest();
}

run();

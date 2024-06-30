import fs from 'fs-extra';

import {createManifest} from '../configuration/manifest';
import {isDev, resolve} from '../configuration/utilities';

export async function run() {
  const path = resolve(
    isDev ? 'build/.dev/manifest.json' : 'build/manifest.json',
  );

  if (isDev) {
    await fs.ensureDir(resolve('build/.dev'));
  }

  await fs.writeJSON(path, await createManifest(), {
    spaces: 2,
  });
}

run();

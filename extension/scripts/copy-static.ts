import fs from 'fs-extra';
import {resolve} from '../configuration/utilities';

async function run() {
  const dir = await fs.readdir(resolve('static'));

  for (const file of dir) {
    await fs.copy(resolve('static', file), resolve('build', file));
  }
}

run();

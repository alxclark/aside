// generate stub index.html files for dev entry
import { execSync } from 'child_process'
import fs from 'fs-extra'
import chokidar from 'chokidar'
import { isDev, log, port, r } from './utils'

/**
 * Stub index.html to use Vite in development
 */
async function stubIndexHtml() {
  const views = [
    'options',
    'popup',
    'background',
    'devtools',
  ]

  for (const view of views) {
    await fs.ensureDir(r(`extension/dist/${view}`))
    let data = await fs.readFile(r(`src/pages/${view}/index.html`), 'utf-8')
    data = data
      .replace('"./main.tsx"', `"http://localhost:${port}/pages/${view}/main.tsx"`)
      .replace('"./main.ts"', `"http://localhost:${port}/pages/${view}/main.ts"`)
      .replace('"./index.ts"', `"http://localhost:${port}/pages/${view}/index.ts"`)
      .replace('"./index.tsx"', `"http://localhost:${port}/pages/${view}/index.tsx"`)
      .replace('<div id="app"></div>', '<div id="app">Vite server did not start</div>')
    await fs.writeFile(r(`extension/dist/${view}/index.html`), data, 'utf-8')
    log('PRE', `stub ${view}`)
  }

  await fs.ensureDir(r('extension/dist/devtools'))
  let data = await fs.readFile(r('src/pages/devtools/panel.html'), 'utf-8')
  data = data
    .replace('"./panel.tsx"', `"http://localhost:${port}/pages/devtools/panel.tsx"`)
    .replace('<div id="app"></div>', '<div id="app">Vite server did not start</div>')
  await fs.writeFile(r('extension/dist/devtools/panel.html'), data, 'utf-8')
  log('PRE', 'stub devtools/panel')
}

function writeManifest() {
  execSync('npx esno ./scripts/manifest.ts', { stdio: 'inherit' })
}

writeManifest()

if (isDev) {
  stubIndexHtml()
  chokidar.watch(r('src/**/*.html'))
    .on('change', () => {
      stubIndexHtml()
    })
  chokidar.watch([r('src/manifest.ts'), r('package.json')])
    .on('change', () => {
      writeManifest()
    })
}

async function run() {
  const src = browser.runtime.getURL('content.js');
  const contentMain = await import(src);
  contentMain.run();
}

run();

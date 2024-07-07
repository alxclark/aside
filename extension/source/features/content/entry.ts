async function run() {
  const src = chrome.runtime.getURL('content.js');
  const contentMain = await import(src);
  contentMain.run();
}

run();

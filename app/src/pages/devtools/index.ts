// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
browser.runtime.onConnect.addListener(() => {
  console.log('do nothing');
});

browser.devtools.panels.create('Aside', '', 'dist/pages/devtools/panel.html');

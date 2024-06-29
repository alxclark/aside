browser.runtime.onConnect.addListener(() => {});

browser.devtools.panels.create('Aside', '', 'build/devtools/panel.html');

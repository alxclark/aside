browser.runtime.onConnect.addListener(() => {});

browser.devtools.panels.create('Aside', '', '/devtools/panel.html');

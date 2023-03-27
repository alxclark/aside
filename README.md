# aside <img src="./app/extension/assets/logo-16.png">

Aside is a modular browser extension built to be a companion to any web application. The libraries provided by Aside allows users to render React components in their own application and uses a custom remote and reconciler to render those components into the Chrome developer tools.

This notably allows developers to build developer tools that can evolve based on any application context. Users might want to use this to tailor their development experience based on:
* State management library (Redux, Recoil, Jotai)
* State persistence (Apollo cache, local storage)
* App routes

## [Example](https://github.com/alxclark/aside/tree/main/packages/recoil)

<img src="./images/devtools.png">

The chrome extension is powered by Shopify's [remote-ui](https://github.com/Shopify/remote-ui) which enables remote rendering.

## Getting started

1. Install dependencies.

```sh
yarn
```

2. Start the development server of the browser extension.

```sh
yarn dev
```

3. Start a Chrome instance with the extension installed in development mode.

```sh
yarn open-chrome
```

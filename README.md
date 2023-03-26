# aside <img src="./app/extension/assets/logo-16.png">

Aside is a modular browser extension built to be a companion to any web application. The libraries provided by Aside allows users to render React components in their own application and uses a custom remote and reconciler to render those components into the Chrome developer tools.

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

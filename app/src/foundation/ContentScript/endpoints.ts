import {
  DevtoolsApiForContentScript,
  WebpageApi,
  fromWebpage,
} from '@aside/core';
import {createEndpoint} from '@remote-ui/rpc';
import {Runtime} from 'webextension-polyfill';

import {createUnsafeEncoder, fromPort} from '../Remote';

export function createDevtoolsEndpoint(port: Runtime.Port) {
  return createEndpoint<DevtoolsApiForContentScript>(fromPort(port), {
    callable: ['getRemoteChannel', 'getApi'],
  });
}

export function createWebpageEndpoint() {
  return createEndpoint<WebpageApi>(fromWebpage({context: 'content-script'}), {
    callable: ['mountDevtools', 'unmountDevtools', 'log'],
    createEncoder: createUnsafeEncoder,
  });
}

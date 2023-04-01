import type {Browser, Runtime} from 'webextension-polyfill';
import {DeepPartial} from 'ts-essentials';

export function mockBrowser(browser?: DeepPartial<Browser>): void {
  const browserMock = {
    ...browser,
    runtime: {
      connect: vi.fn(() => createPort()),
      onConnect: {
        addListener: vi.fn(),
        hasListener: vi.fn(() => false),
        hasListeners: vi.fn(() => false),
        removeListener: vi.fn(),
      },
      ...browser?.runtime,
    },
  } as Browser;

  vi.stubGlobal('browser', browserMock);
}

export function createPort(port?: DeepPartial<Runtime.Port>): Runtime.Port {
  return {
    name: 'port',
    disconnect: vi.fn(),
    postMessage: vi.fn(),
    ...port,
    onDisconnect: {
      addListener: vi.fn(),
      hasListener: vi.fn(() => false),
      hasListeners: vi.fn(() => false),
      removeListener: vi.fn(),
      ...port?.onDisconnect,
    },
    onMessage: {
      addListener: vi.fn(),
      hasListener: vi.fn(() => false),
      hasListeners: vi.fn(() => false),
      removeListener: vi.fn(),
      ...port?.onMessage,
    },
  } as Runtime.Port;
}

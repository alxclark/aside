import React from 'react';
import {createMount} from '@shopify/react-testing';
import {StatefullExtensionApi} from '@aside/core';
import {StatefulRemoteSubscribable} from '@remote-ui/async-subscription';
import {DeepPartial} from 'ts-essentials';

import {ExtensionApiContext} from '../context';

export interface Options {
  extensionApi?: DeepPartial<StatefullExtensionApi>;
}

export interface Context {
  extensionApi: StatefullExtensionApi;
}

export const mount = createMount<Options, Context, true>({
  context({extensionApi}) {
    return {extensionApi: createExtensionApi(extensionApi)};
  },
  render(element, {extensionApi}) {
    return (
      <ExtensionApiContext.Provider value={extensionApi}>
        {element}
      </ExtensionApiContext.Provider>
    );
  },
  async afterMount(_root) {},
  cleanup(_root) {},
});

export function createExtensionApi(
  partial?: DeepPartial<StatefullExtensionApi>,
): StatefullExtensionApi {
  return {
    activity: {
      filter: [createMockStatefulRemoteSubscribable(''), vi.fn()],
      invertFilter: [createMockStatefulRemoteSubscribable(false), vi.fn()],
      preserveLog: [createMockStatefulRemoteSubscribable(false), vi.fn()],
      recordSnapshot: [createMockStatefulRemoteSubscribable(false), vi.fn()],
      showFilter: [createMockStatefulRemoteSubscribable(false), vi.fn()],
      showPreviousValues: [
        createMockStatefulRemoteSubscribable(false),
        vi.fn(),
      ],
      showTimelineOptions: [
        createMockStatefulRemoteSubscribable(false),
        vi.fn(),
      ],
      ...(partial?.activity as any),
    },
    network: {
      requests: createMockStatefulRemoteSubscribable([]),
      clear: vi.fn(),
      onRequestFinished: vi.fn(),
      ...(partial?.network as any),
    },
    storage: {
      ...partial?.storage,
      local: {
        get: vi.fn(async () => ({})),
        set: vi.fn(),
        ...partial?.storage?.local,
      },
    },
  };
}

export function createMockStatefulRemoteSubscribable<T>(
  value: T,
): StatefulRemoteSubscribable<T> {
  return {
    current: value,
    destroy: vi.fn(),
    subscribe: vi.fn(() => vi.fn()),
  };
}

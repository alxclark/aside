import {signal, Signal} from '@preact/signals-core';

import {Action, Dispatch, State} from './types';
import {createDevtoolsEndpoint, createWebpageEndpoint} from './endpoints';
import {exposeDevtools, exposeWebpage} from './api';

function reducer(state: State, action: Action, dispatch: Dispatch): State {
  switch (action.type) {
    case 'init': {
      const endpoint = createWebpageEndpoint();

      // Even if we don't have a devtools endpoint yet to allow all messages,
      // we still need to expose the methods on the endpoint
      // to respond to simpler actions like updating the extension badge.
      exposeWebpage(endpoint, undefined, dispatch);

      return {
        ...state,
        webpage: {
          ...state.webpage,
          endpoint,
        },
      };
    }
    case 'webpage-ready': {
      if (state.webpage.ready) return state;
      // Potential impossible state where webpage is ready
      // before content-script. There's no evidence that this happens for now.
      if (!state.webpage.endpoint) return state;

      const devtoolsEndpoint =
        'endpoint' in state.devtools ? state.devtools.endpoint : undefined;

      exposeWebpage(state.webpage.endpoint, devtoolsEndpoint, dispatch);

      return {
        ...state,
        webpage: {
          ...state.webpage,
          ready: true,
          endpoint: state.webpage.endpoint,
        },
      };
    }
    case 'devtools-ready': {
      // Since we always create a webpage endpoint in the content-script
      // before the webpage is even opened, this should not happen.
      if (!state.webpage.endpoint) return state;

      // When a devtools port is already mounted, unmount the devtools
      // in the webpage. When the devtools port changes, the remote
      // still contains references to functions that do not exist
      // in the new devtools. Removing the UI wipes any function references
      // pointing to the old/destroyed host.
      if (state.devtools.ready) {
        state.webpage.endpoint?.call.unmountDevtools();
      }

      const endpoint = createDevtoolsEndpoint(action.port);

      exposeDevtools(endpoint, state.webpage.endpoint);
      exposeWebpage(state.webpage.endpoint, endpoint, dispatch);

      return {
        ...state,
        devtools: {
          port: action.port,
          endpoint,
          ready: true,
        },
      };
    }
    case 'devtools-disconnected': {
      // Another devtools panel could connect while the other listener is still around.
      // In that case we don't want to unmount and destroy the communication
      // that's in place between the new devtools endpoint and the webpage.
      if (state.devtools.ready && state.devtools.port !== action.port)
        return state;

      state.webpage.endpoint?.call.unmountDevtools();

      return {
        ...state,
        devtools: {
          ready: false,
        },
      };
    }
  }
}

export function createReducer(initialState: State): [Signal<State>, Dispatch] {
  const state = signal(initialState);

  const dispatch: Dispatch = (action) => {
    state.value = reducer(state.value, action, dispatch);
  };

  return [state, dispatch];
}

import React from 'react';
import {RecoilRoot} from 'recoil';

import {DevToolsApi} from './types';
import {PrimaryPanel} from './components';

export function RemoteDevTools({api}: {api: DevToolsApi}) {
  return (
    <ErrorBoundary>
      <RecoilRoot key="@companion/recoil">
        <PrimaryPanel api={api} />
      </RecoilRoot>
    </ErrorBoundary>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return {hasError: true};
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.log({error, errorInfo});
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

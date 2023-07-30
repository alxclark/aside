import React, {Component, ErrorInfo, ReactNode} from 'react';
import {Flex, Text} from '@aside/chrome-ui';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return {hasError: true};
  }

  public state: State = {
    hasError: false,
  };

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Flex
          fullHeight
          justifyContent="center"
          alignItems="center"
          direction="column"
          gap="10px"
        >
          <Text>Aw snap!</Text>
          <Text>Something went wrong while displaying the devtools panel.</Text>
        </Flex>
      );
    }

    return this.props.children;
  }
}

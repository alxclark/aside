import React, {Component, ErrorInfo, ReactNode} from 'react';
import {View, Text} from '@aside/chrome-ui-remote';

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
        <View className="h-full justify-center items-center flex-col gap-2">
          <Text>Aw snap!</Text>
          <Text>Something went wrong while displaying the devtools panel.</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

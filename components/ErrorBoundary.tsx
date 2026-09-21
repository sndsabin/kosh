import { Component, type ReactNode } from "react";

import ErrorScreen from "./ErrorScreen";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
  retryCount: number;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = {
    error: null,
    retryCount: 0,
  };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  handleRetry = () => {
    // clear the error and increase if the retryCount if it's first time
    // otherwise, reload the app

    if (this.state.retryCount >= 1) {
      window.location.reload();
      return;
    }

    this.setState((prev) => ({ error: null, retryCount: prev.retryCount + 1 }));
  };

  render() {
    if (this.state.error) {
      return (
        <ErrorScreen
          error={this.state.error.message || "An unexpected error occured."}
          onRetry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

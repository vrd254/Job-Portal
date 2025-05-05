import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h2 className="text-red-500 p-4">Something went wrong in the UI.</h2>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

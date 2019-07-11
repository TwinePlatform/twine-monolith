import React from 'react';


class Boundary<T extends {}> extends React.Component<T, { hasError: boolean }> {
  constructor (props: Readonly<T>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError (error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: any }) {
    console.log(error, errorInfo);
  }

  render () {
    if (this.state.hasError) {
      return <div>Ooops</div>;
    }

    return this.props.children;
  }
}

export default Boundary;

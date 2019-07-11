import React from 'react';
import { AxiosError } from 'axios';
import { propOr } from 'ramda';


type ErrorBoundaryState = {
  hasError: boolean
  isHttpError: boolean
  statusCode: number
  message: string
};

class Boundary<T extends {}> extends React.Component<T, ErrorBoundaryState> {
  constructor (props: Readonly<T>) {
    super(props);
    this.state = {
      hasError: false,
      isHttpError: false,
      statusCode: 0,
      message: '',
    };
  }

  static getDerivedStateFromError (error: Error | AxiosError) {
    return {
      hasError: true,
      isHttpError: error.hasOwnProperty('isAxiosError'),
      statusCode: propOr(0, 'code', error),
      message: error.message,
    };
  }

  componentDidCatch (error: Error, errorInfo: { componentStack: any }) {
    console.log(error, errorInfo);
  }

  renderError () {
    return (
      <div>
        <div>
          {
            this.state.isHttpError
              ? 'There was an problem fetching your data'
              : 'There was a problem with the application'
          }
        </div>
        <div>
          {
            this.state.message
          }
        </div>
        <div>
          {
            this.state.isHttpError && <span>Status Code: {this.state.statusCode}</span>
          }
        </div>
      </div>
    );
  }

  render () {
    if (this.state.hasError) {
      return this.renderError();
    }

    return this.props.children;
  }
}

export default Boundary;

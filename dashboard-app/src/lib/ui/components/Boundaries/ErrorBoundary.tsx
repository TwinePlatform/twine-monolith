import React from 'react';
import { AxiosError } from 'axios';
import { propOr } from 'ramda';


type ErrorBoundaryState = {
  hasError: boolean
  isHttpError: boolean
  statusCode: number
  message: string
};

const isHttpError = (error: Error) =>
  ['isAxiosError', 'response']
    .reduce((acc, s) => acc || error.hasOwnProperty(s), false);

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
      isHttpError: isHttpError(error),
      statusCode: propOr(0, 'code', error),
      message: error.message,
    };
  }

  componentDidCatch (error: Error, errorInfo: { componentStack: any }) {
    if (process.env.NODE_ENV !== 'test') {
      console.log(error, errorInfo);
    }
  }

  renderError () {
    return (
      <div>
        <div>
          {
            this.state.isHttpError
              ? 'There was a problem fetching your data'
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

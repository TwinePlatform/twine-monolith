/*
 * Class Component providing common behaviour for error boundaries
 * https://reactjs.org/docs/error-boundaries.html
 *
 * Needs to be a class component because hooks cannot yet replicate
 * the "getDerivedStateFromError" and "componentDidCatch" methods
 *
 * Each child class MUST implement the `renderError` method which
 * returns the components which will be rendered in the case of an error
 *
 * Usage:
 *   class NewErrorBoundary<Props> extends BaseErrorBoundary<Props> {
 *     renderError() {
 *       return (...);
 *     }
 *   }
 */
import React from 'react';
import { AxiosError } from 'axios';
import { propOr, pathOr } from 'ramda';


type ErrorBoundaryState = {
  hasError: boolean
  isHttpError: boolean
  statusCode: number
  message: string
};


const isHttpError = (error: Error) =>
  ['isAxiosError', 'response']
    .reduce((acc, s) => acc || error.hasOwnProperty(s), false);


class BaseErrorBoundary<T extends {}> extends React.Component<T, ErrorBoundaryState> {
  state = {
    hasError: false,
    isHttpError: false,
    statusCode: 0,
    message: '',
  }

  static getDerivedStateFromError (error: Error | AxiosError) {
    return {
      hasError: true,
      isHttpError: isHttpError(error),
      statusCode: propOr(pathOr(0, ['response', 'status'], error), 'code', error),
      message: error.message,
    };
  }

  componentDidCatch (error: Error, errorInfo: { componentStack: any }) {
    if (process.env.NODE_ENV !== 'test') {
      console.log(error, errorInfo);
    }
  }

  renderError (): JSX.Element {
    throw new Error('Must be implemented');
  }

  render () {
    if (this.state.hasError) {
      return this.renderError();
    }

    return this.props.children;
  }
}

export default BaseErrorBoundary;

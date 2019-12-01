/*
 * Simple utility component to trigger fallback to error boundary component
 * based on "error" prop value.
 *
 * See RedirectHttpErrorBoundary for usage
 */
import React from 'react';

const ThrowIfError: React.FunctionComponent<{ error?: Error }> = ({ error, children }) => {
  if (error) {
    throw error;
  }

  return (<>{children}</>);
};

export default ThrowIfError;

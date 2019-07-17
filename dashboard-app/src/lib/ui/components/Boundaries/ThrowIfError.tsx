import React from 'react';

const ThrowIfError: React.FunctionComponent<{ error?: Error }> = ({ error, children }) => {
  if (error) {
    throw error;
  }

  return (<>{children}</>);
};

export default ThrowIfError;

import React from 'react';
import LoadingBoundary from './LoadingBoundary';
import ThrowIfError from './ThrowIfError';


type LoadingHookBoundaryProps = {
  error?: Error
  loading?: boolean
};


export const LoadingHookBoundary: React.FunctionComponent<LoadingHookBoundaryProps> = (props) => {
  return (
    <LoadingBoundary isLoading={props.loading}>
      <ThrowIfError error={props.error} />
      { props.children }
    </LoadingBoundary>
  );
};

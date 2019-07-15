import React from 'react';
import LoadingBoundary from './LoadingBoundary';
import RedirectErrorBoundary from './RedirectErrorBoundary';
import ThrowIfError from './ThrowIfError';


type RedirectHttpErrorBoundaryProps = {
  error?: Error
  loading?: boolean
};


const RedirectHttpErrorBoundary: React.FC<RedirectHttpErrorBoundaryProps> = (props) => {
  return (
    <RedirectErrorBoundary>
      <LoadingBoundary isLoading={props.loading}>
        <ThrowIfError error={props.error} />
        { props.children }
      </LoadingBoundary>
    </RedirectErrorBoundary>
  );
};


export default RedirectHttpErrorBoundary;

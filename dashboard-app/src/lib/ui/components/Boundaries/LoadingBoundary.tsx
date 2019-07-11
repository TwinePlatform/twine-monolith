import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import { ColoursEnum } from '../../design_system';
import { BeatLoader } from 'react-spinners';


type LoadingBoundaryProps = {
  isLoading?: boolean | (() => boolean)
};


class LoadingBoundary extends ErrorBoundary<LoadingBoundaryProps> {
  render () {
    const { isLoading = false } = this.props;

    const showLoading = typeof isLoading === 'function'
      ? isLoading()
      : isLoading;

    if (showLoading) {
      return <BeatLoader color={ColoursEnum.purple} />;
    }

    return super.render();
  }
}

export default LoadingBoundary;

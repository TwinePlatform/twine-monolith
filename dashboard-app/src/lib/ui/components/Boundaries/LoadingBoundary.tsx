import React from 'react';
import RenderErrorBoundary from './RenderErrorBoundary';
import { ColoursEnum } from '../../design_system';
import { BeatLoader } from 'react-spinners';


type LoadingBoundaryProps = {
  isLoading?: boolean | (() => boolean)
};


class LoadingBoundary extends React.Component<LoadingBoundaryProps> {
  render () {
    const { isLoading = false } = this.props;

    const showLoading = typeof isLoading === 'function'
      ? isLoading()
      : isLoading;

    if (showLoading) {
      return <BeatLoader color={ColoursEnum.purple} />;
    }

    return this.props.children;
  }
}

export default LoadingBoundary;

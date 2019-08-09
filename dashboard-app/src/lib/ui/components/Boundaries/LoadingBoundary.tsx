import React from 'react';
import { ColoursEnum } from '../../design_system';
import { BallSpinner } from 'react-spinners-kit';


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
      return <BallSpinner color={ColoursEnum.purple} />;
    }

    return this.props.children;
  }
}

export default LoadingBoundary;

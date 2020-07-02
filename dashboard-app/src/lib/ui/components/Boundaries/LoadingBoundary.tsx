import React from 'react';
import { BeatLoader } from 'react-spinners';
import { FullScreenBeatLoader } from '../Loaders';
import { ColoursEnum } from '../../design_system';


type LoadingBoundaryProps = {
  isLoading?: boolean | (() => boolean);
  fullscreen?: boolean;
};


class LoadingBoundary extends React.Component<LoadingBoundaryProps> {
  render () {
    const { isLoading = false, fullscreen = false } = this.props;

    const showLoading = typeof isLoading === 'function'
      ? isLoading()
      : isLoading;

    if (showLoading) {
      return fullscreen
        ? <FullScreenBeatLoader color={ColoursEnum.purple} />
        : <BeatLoader color={ColoursEnum.purple} />;
    }

    return this.props.children;
  }
}

export default LoadingBoundary;

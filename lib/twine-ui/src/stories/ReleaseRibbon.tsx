import React from 'react';
import { storiesOf } from '@storybook/react';
import ReleaseRibbon from '../components/ReleaseRibbon/ReleaseRibbon';

storiesOf('Release Ribbon', module)
  .add('top left', () => (
    <ReleaseRibbon fixed={true} position="topLeft" text="Staging"/>
  ))
  .add('top right', () => (
    <ReleaseRibbon fixed={true} position="topRight" text="Staging"/>
  ))
  .add('bottom left', () => (
    <ReleaseRibbon fixed={true} position="bottomLeft" text="Staging"/>
  ))
  .add('bottom right', () => (
    <ReleaseRibbon fixed={true} position="bottomRight" text="Staging"/>
  ));

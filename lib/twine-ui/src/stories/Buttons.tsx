import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import {Button, CancelButton, BigButton} from '../Buttons';

storiesOf('Button', module)
  .add('with text', () => (
    <Button onClick={action('clicked')}>
      Hello Button
    </Button>
  ));

storiesOf('CancelButton', module)
  .add('with text', () => (
    <CancelButton onClick={action('clicked')}>
      Cancel Button
    </CancelButton>
  ));

storiesOf('BigButton', module)
  .add('with text', () => (
    <BigButton onClick={action('clicked')}>
      Big Button
    </BigButton>
  ));

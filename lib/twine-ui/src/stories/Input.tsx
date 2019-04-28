import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Input from '../Input';

storiesOf('Input', module)
  .add('with no label', () => (
    <Input type="text" />
  ))
  .add('with label', () => (
    <Input type="text" label="Name" />
  ))
  .add('with label & error', () => (
    <Input type="text" label="Name" error="oopsy" />
  ));
